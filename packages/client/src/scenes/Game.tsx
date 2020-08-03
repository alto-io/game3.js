import { navigate, RouteComponentProps } from '@reach/router';
import { Constants, Keys, Maths, Types } from '@game3js/common';
import { Client, Room } from 'colyseus.js';
import qs from 'querystringify';
import React, { Component, RefObject } from 'react';
import { isMobile } from 'react-device-detect';
import { Helmet } from 'react-helmet';
import ReactNipple from 'react-nipple';
import { View } from '../components';
import GameManager from '../managers/GameManager';

import { localSaveReplay, clientSaveTournamentReplay, putTournamentResult } from "../helpers/database";

import GameResult from '../components/GameResult'

import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

declare global {
  interface Window { MediaRecorder: any; }
}

interface IProps extends RouteComponentProps {
  roomId?: string;
}

interface IState {
  playerId: string;
  tournamentId: string;
  playersCount: number;
  maxPlayersCount: number;
  showResult: boolean;
}

export default class Game extends Component<IProps, IState> {

  public state = {
    playerId: '',
    tournamentId: 'demo',
    playersCount: 0,
    maxPlayersCount: 0,
    showResult: false
  };

  private gameCanvas: RefObject<HTMLDivElement>;
  private gameManager: GameManager;
  private client?: Client;
  public room?: Room;

  private mediaRecorder: any;
  private recordedBlobs: any;
  private sourceBuffer: any;
  private video: any;
  private canvas: any;
  private stream: any;
  private mediaSource: any;
  private gameOver: boolean;
  private recordFileHash: any;

  // BASE
  constructor(props: IProps) {
    super(props);

    this.gameCanvas = React.createRef();
    this.gameManager = new GameManager(
      window.innerWidth,
      window.innerHeight,
      this.handleActionSend,
    );

    this.gameOver = false;
    this.recordFileHash = null;
  }

  
  async componentDidMount() {
    await this.start();

    this.mediaSource = new window.MediaSource();
    // this.mediaSource.addEventListener('sourceopen', this.handleSourceOpen, false);
  
    this.canvas = document.querySelector('canvas');
    this.video = document.querySelector('video');

    if (this.canvas) {
      this.stream = this.canvas.captureStream(); // frames per second
      console.log('Started stream capture from canvas element: ', this.stream);
    }

  }

  componentWillUnmount() {
    this.stop();
  }


  // LIFECYCLE
  start = async () => {
    const {
      roomId = '',
      location: {
        search = '',
      } = {},
    } = this.props;

    const isNewRoom = roomId === 'new';
    const parsedSearch = qs.parse(search) as Types.IRoomOptions;
    const tournamentId = parsedSearch.tournamentId

    let options;
    if (isNewRoom) {
      options = {
        ...parsedSearch,
        roomMaxPlayers: Number(parsedSearch.roomMaxPlayers),
      };
    } else {
      // The only thing to pass when joining an existing room is a player's name
      options = {
        playerName: localStorage.getItem('playerName'),
      };
    }
    options.tournamentId = tournamentId

    // Connect
    try {
      const host = window.document.location.host.replace(/:.*/, '');
      const port = process.env.NODE_ENV !== 'production' ? Constants.WS_PORT : window.location.port;
      const url = window.location.protocol.replace('http', 'ws') + "//" + host + (port ? ':' + port : '');

      this.client = new Client(url);
      if (isNewRoom) {
        this.room = await this.client.create(Constants.ROOM_NAME, options);

        // We replace the "new" in the URL with the room's id
        window.history.replaceState(null, '', `/${this.room.id}`);
      } else {
        this.room = await this.client.joinById(roomId, options);
      }
    } catch (error) {
      navigate('/');
      return;
    }

    this.setState({
      playerId: this.room.sessionId,
      tournamentId,
    });

    // Listen for state changes
    this.room.state.game.onChange = this.handleGameChange;
    this.room.state.players.onAdd = this.handlePlayerAdd;
    this.room.state.players.onChange = this.handlePlayerUpdate;
    this.room.state.players.onRemove = this.handlePlayerRemove;
    this.room.state.monsters.onAdd = this.handleMonsterAdd;
    this.room.state.monsters.onChange = this.handleMonsterUpdate;
    this.room.state.monsters.onRemove = this.handleMonsterRemove;
    this.room.state.props.onAdd = this.handlePropAdd;
    this.room.state.props.onChange = this.handlePropUpdate;
    this.room.state.props.onRemove = this.handlePropRemove;
    this.room.state.bullets.onAdd = this.handleBulletAdd;
    this.room.state.bullets.onChange = this.handleBulletAdd;
    this.room.state.bullets.onRemove = this.handleBulletRemove;

    // Listen for Messages
    this.room.onMessage("*", this.handleMessage);

    // Start game
    this.gameManager.start(this.gameCanvas.current);

    // Listen for inputs
    window.document.addEventListener('mousedown', this.handleMouseDown);
    window.document.addEventListener('mouseup', this.handleMouseUp);
    window.document.addEventListener('keydown', this.handleKeyDown);
    window.document.addEventListener('keyup', this.handleKeyUp);
    window.addEventListener('resize', this.handleWindowResize);
  }

  stop = () => {
    // Colyseus
    if (this.room) {
      this.room.leave();
    }

    // Game
    this.gameManager.stop();

    // Inputs
    window.document.removeEventListener('mousedown', this.handleMouseDown);
    window.document.removeEventListener('mouseup', this.handleMouseUp);
    window.document.removeEventListener('keydown', this.handleKeyDown);
    window.document.removeEventListener('keyup', this.handleKeyUp);
    window.removeEventListener('resize', this.handleWindowResize);
  }


  // HANDLERS: Colyseus
  handleGameChange = (attributes: any) => {
    for (const row of attributes) {
      this.gameManager.gameUpdate(row.field, row.value);
    }
  }

  handlePlayerAdd = (player: any, playerId: string) => {
    const isMe = playerId === this.state.playerId;
    this.gameManager.playerAdd(playerId, player, isMe);
    this.updatePlayersCount();
  }

  handlePlayerUpdate = (player: any, playerId: string) => {
    const isMe = playerId === this.state.playerId;
    this.gameManager.playerUpdate(playerId, player, isMe);
  }

  handlePlayerRemove = (player: any, playerId: string) => {
    const isMe = playerId === this.state.playerId;
    this.gameManager.playerRemove(playerId, isMe);
    this.updatePlayersCount();
  }

  handleMonsterAdd = (monster: any, monsterId: string) => {
    this.gameManager.monsterAdd(monsterId, monster);
  }

  handleMonsterUpdate = (monster: any, monsterId: string) => {
    this.gameManager.monsterUpdate(monsterId, monster);
  }

  handleMonsterRemove = (monster: any, monsterId: string) => {
    this.gameManager.monsterRemove(monsterId);
  }

  handlePropAdd = (prop: any, propId: string) => {
    this.gameManager.propAdd(propId, prop);
  }

  handlePropUpdate = (prop: any, propId: string) => {
    this.gameManager.propUpdate(propId, prop);
  }

  handlePropRemove = (prop: any, propId: string) => {
    this.gameManager.propRemove(propId);
  }

  handleBulletAdd = (bullet: any, bulletId: string) => {
    this.gameManager.bulletAdd(bullet);
  }

  handleBulletRemove = (bullet: any, bulletId: string) => {
    this.gameManager.bulletRemove(bulletId);
  }

  handleMessage = (type: any, message: any) => {
    switch (message.type) {
      case 'waiting':
        this.gameManager.hudLogAdd(`Waiting for other players...`);
        this.gameManager.hudAnnounceAdd(`Waiting for other players...`);
        break;
      case 'start': // TODO: add better state management for recording and leaving rooms
        const { tournamentId } = this.state
        const playingTournament = !!tournamentId
        if (this.gameOver)
        {
          toast.info("Game finished!");
          if (!playingTournament) {
            navigate('/');
          } else {
            const options = {
              recordFileHash: this.recordFileHash,
              tournamentId 
            }
            //navigate(`/tournaments${qs.stringify(options, true)}`);
          }
        }
        else 
        {
          this.gameManager.hudLogAdd(`Game starts!`);
          this.gameManager.hudAnnounceAdd(`Game starts!`);
          this.startRecording();
        }
        break;
      case 'stop':
        this.gameManager.hudLogAdd(`Game ends...`);
        this.gameOver = true;
        this.stopRecording();
        this.setState({
          showResult: true
        })
        break;
      case 'joined':
        this.gameManager.hudLogAdd(`"${message.params.name}" joins.`);
        break;
      case 'killed':
        this.gameManager.hudLogAdd(`"${message.params.killerName}" kills "${message.params.killedName}".`);
        break;
      case 'won':
        this.gameManager.hudLogAdd(`"${message.params.name}" wins!`);
        this.gameManager.hudAnnounceAdd(`${message.params.name} wins!`);
        break;
      case 'left':
        this.gameManager.hudLogAdd(`"${message.params.name}" left.`);
        break;
      case 'timeout':
        this.gameManager.hudAnnounceAdd(`Timeout...`);
        break;
      default:
        break;
    }
  }

  // HANDLERS: Gameplay Recorder
  startRecording() {
    let options: any = { mimeType: 'video/webm' };
    this.recordedBlobs = [];
    try {
        this.mediaRecorder = new window.MediaRecorder(this.stream, options);
    } catch (e0) {
        console.log('Unable to create MediaRecorder with options Object: ', e0);
        try {
            options = { mimeType: 'video/webm,codecs=vp9' };
            this.mediaRecorder = new window.MediaRecorder(this.stream, options);
        } catch (e1) {
            console.log('Unable to create MediaRecorder with options Object: ', e1);
            try {
                options = 'video/vp8'; // Chrome 47
                this.mediaRecorder = new window.MediaRecorder(this.stream, options);
            } catch (e2) {
                alert('MediaRecorder is not supported by this browser.\n\n' +
                    'Try Firefox 29 or later, or Chrome 47 or later, ' +
                    'with Enable experimental Web Platform features enabled from chrome://flags.');
                console.error('Exception while creating MediaRecorder:', e2);
                return;
            }
        }
    }
    console.log('Created MediaRecorder', this.mediaRecorder, 'with options', options);

    this.mediaRecorder.onstop = (event) => {
        // console.log('Recorder stopped: ', event);
        // const superBuffer = new Blob(this.recordedBlobs, { type: 'video/webm' });
        // this.video.src = window.URL.createObjectURL(superBuffer);
    }

    this.mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
            this.recordedBlobs.push(event.data);
        }
    }

    this.mediaRecorder.start(100); // collect 100ms of data
    // console.log('MediaRecorder started', this.mediaRecorder);
  }

  stopRecording = async () => {
      this.mediaRecorder.stop();

      // TODO: playerId = roomId? change to something more meaningful
      const playerId = this.state.playerId;
      const tournamentId = this.state.tournamentId || 'demo';
      const time = this.gameManager.gameEndsAt - Date.now();

      console.log('Recorded Blobs: ', this.recordedBlobs);

      const replayDate = new Date();
      const filename = "replay_" + playerId + "_" + replayDate.valueOf() + ".webm";
      const options = {type:'video/webm'};

      const file = new File(this.recordedBlobs, filename, options);
  
      // this.video.controls = true;


      // TODO: move to web worker so it doesn't pause main thread
      if (tournamentId === 'demo') {
        localSaveReplay(playerId, tournamentId, time, file);
      } else {
        this.recordFileHash = await clientSaveTournamentReplay(file);
        //const resultId = 1
        //const result = await putTournamentResult(tournamentId, resultId, fileHash);
        //console.log(result)
      }
  }


  // HANDLERS: GameManager
  handleActionSend = (action: any) => {
    if (!this.room) {
      return;
    }

    this.room.send("action", action);
  }


  // HANDLERS: Inputs
  handleMouseDown = (event: any) => {
    event.preventDefault();
    event.stopPropagation();
    this.gameManager.inputs.shoot = true;
  }

  handleMouseUp = (event: any) => {
    event.preventDefault();
    event.stopPropagation();
    this.gameManager.inputs.shoot = false;
  }

  handleKeyDown = (event: any) => {
    const key = event.code;

    if (Keys.LEFT.includes(key)) {
      event.preventDefault();
      event.stopPropagation();
      this.gameManager.inputs.left = true;
    }

    if (Keys.UP.includes(key)) {
      event.preventDefault();
      event.stopPropagation();
      this.gameManager.inputs.up = true;
    }

    if (Keys.RIGHT.includes(key)) {
      event.preventDefault();
      event.stopPropagation();
      this.gameManager.inputs.right = true;
    }

    if (Keys.DOWN.includes(key)) {
      event.preventDefault();
      event.stopPropagation();
      this.gameManager.inputs.down = true;
    }

    if (Keys.SHOOT.includes(key)) {
      event.preventDefault();
      event.stopPropagation();
      this.gameManager.inputs.shoot = true;
    }

    if (Keys.MENU.includes(key)) {
      event.preventDefault();
      event.stopPropagation();
      this.gameManager.inputs.menu = true;
    }
  }

  handleKeyUp = (event: any) => {
    const key = event.code;

    if (Keys.LEFT.includes(key)) {
      event.preventDefault();
      event.stopPropagation();
      this.gameManager.inputs.left = false;
    }

    if (Keys.UP.includes(key)) {
      event.preventDefault();
      event.stopPropagation();
      this.gameManager.inputs.up = false;
    }

    if (Keys.RIGHT.includes(key)) {
      event.preventDefault();
      event.stopPropagation();
      this.gameManager.inputs.right = false;
    }

    if (Keys.DOWN.includes(key)) {
      event.preventDefault();
      event.stopPropagation();
      this.gameManager.inputs.down = false;
    }

    if (Keys.SHOOT.includes(key)) {
      event.preventDefault();
      event.stopPropagation();
      this.gameManager.inputs.shoot = false;
    }

    if (Keys.MENU.includes(key)) {
      event.preventDefault();
      event.stopPropagation();
      this.gameManager.inputs.menu = false;
    }
  }

  handleWindowResize = () => {
    this.gameManager.setScreenSize(window.innerWidth, window.innerHeight);
  }


  // METHODS
  updatePlayersCount = () => {
    this.setState({
      playersCount: this.gameManager.playersCount,
    });
  }

  onResultToggle = (show) => {
    const newShow = !show
    this.setState({
      showResult: newShow
    })
    if (!newShow && this.gameOver) {
      const { tournamentId } = this.state
      const playingTournament = !!tournamentId
      if (!playingTournament) {
        navigate('/');
      } else {
        const options = {
          recordFileHash: this.recordFileHash,
          tournamentId 
        }
        navigate(`/tournaments${qs.stringify(options, true)}`);
      }
    }
  }

  // RENDER
  render() {
    const { showResult } = this.state

    return (
      <View
        style={{
          position: 'relative',
          height: '100%',
        }}
      >
        <Helmet>
          <title>{`Death Match (${this.state.playersCount})`}</title>
        </Helmet>
        <div ref={this.gameCanvas} />
        <GameResult show={showResult} onToggle={this.onResultToggle}/>
        {isMobile && this.renderJoySticks()}

        { 
          // <video id="recorded" loop></video>
        }
      </View>
    );
  }

  renderJoySticks = () => {
    return (
      <View
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
        }}
      >
        {/* Position */}
        <ReactNipple
          options={{ mode: 'static', position: { bottom: '20%', left: '20%' } }}
          onEnd={() => {
            this.gameManager.inputs.up = false;
            this.gameManager.inputs.down = false;
            this.gameManager.inputs.left = false;
            this.gameManager.inputs.right = false;
          }}
          onMove={(event: any, data: any) => {
            const cardinal = Maths.degreeToCardinal(data.angle.degree);
            this.gameManager.inputs.up = cardinal === 'NW' || cardinal === 'N' || cardinal === 'NE';
            this.gameManager.inputs.right = cardinal === 'NE' || cardinal === 'E' || cardinal === 'SE';
            this.gameManager.inputs.down = cardinal === 'SE' || cardinal === 'S' || cardinal === 'SW';
            this.gameManager.inputs.left = cardinal === 'SW' || cardinal === 'W' || cardinal === 'NW';
          }}
        />

        {/* Rotation + shoot */}
        <ReactNipple
          options={{ mode: 'static', position: { bottom: '20%', right: '20%' } }}
          onMove={(event: any, data: any) => {
            const radians = Maths.round2Digits(data.angle.radian - Math.PI);
            let rotation = 0;
            if (radians < 0) {
              rotation = Maths.reverseNumber(radians, -Math.PI, 0);
            } else {
              rotation = Maths.reverseNumber(radians, 0, Math.PI);
            }

            this.gameManager.forcedRotation = rotation;
            this.gameManager.inputs.shoot = true;
          }}
          onEnd={() => {
            this.gameManager.inputs.shoot = false;
          }}
        />
      </View>
    );
  }
}
