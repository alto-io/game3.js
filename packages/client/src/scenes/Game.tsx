import { globalHistory, navigate, RouteComponentProps } from '@reach/router';
import { Constants, Keys, Maths, Types } from '@game3js/common';
import { Client, Room } from 'colyseus.js';
import qs from 'querystringify';
import React, { Component, RefObject } from 'react';
import { isMobile } from 'react-device-detect';
import { Helmet } from 'react-helmet';
import ReactNipple from 'react-nipple';
import { Card, Flex } from "rimble-ui";
import CSS from 'csstype';

import GameManager from '../managers/GameManager';

import { GameJavascriptContext } from './GameJavascript';
import { View } from '../components'
import GameResult from '../components/GameResult'
import TournamentResultsCard from '../components/TournamentResultsCard'
import LeavingGamePrompt from '../components/LeavingGamePrompt';
import GameSceneContainer from '../components/GameSceneContainer';
import { DEFAULT_GAME_DIMENSION } from '../constants'

import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { isThisSecond } from 'date-fns';

interface IProps extends RouteComponentProps {
  roomId?: string;
  drizzle?: any;
  drizzleState?: any;
  startRecording: any;
  stopRecording: any;
  contractMethodSendWrapper?: any;
  gameJavascriptContext: any;
}

interface IState {
  playerId: string;
  tournamentId: string;
  playersCount: number;
  maxPlayersCount: number;
  showResult: boolean;
  recordFileHash: string;
  viewOnly: boolean;
}

export default class Game extends Component<IProps, IState> {

  public state = {
    playerId: '',
    tournamentId: null,
    playersCount: 0,
    maxPlayersCount: 0,
    showResult: false,
    recordFileHash: null,
    viewOnly: false,
  };

  private gameCanvas: RefObject<HTMLDivElement>;
  private gameManager: GameManager;
  private client?: Client;
  public room?: Room;

  // BASE
  constructor(props: IProps) {
    super(props);

    this.gameCanvas = React.createRef();
    this.gameManager = new GameManager(
      DEFAULT_GAME_DIMENSION.width,
      DEFAULT_GAME_DIMENSION.height,
      this.handleActionSend,
    );
  }


  async componentDidMount() {
    await this.start();
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
    options.playerAddress = this.props.drizzleState.accounts[0]

    if (options.viewOnly === 'true') {
      this.setState({
        tournamentId,
        viewOnly: true,
      })
      return
    }

    // Connect
    try {
      const host = window.document.location.host.replace(/:.*/, '');
      const port = process.env.NODE_ENV !== 'production' ? Constants.WS_PORT : window.location.port;
      const url = window.location.protocol.replace('http', 'ws') + "//" + host + (port ? ':' + port : '');

      this.client = new Client(url);
      if (isNewRoom) {
        this.room = await this.client.create(Constants.ROOM_NAME, options);

        // We replace the "new" in the URL with the room's id
        window.history.replaceState(null, '', `/game/${this.room.id}`);
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

  handleMessage = async (type: any, message: any) => {
    const { gameJavascriptContext } = this.props;
    const { tournamentId } = this.state

    console.log("TOURNAMENT ID", tournamentId)

    switch (message.type) {
      case 'waiting':
        this.gameManager.hudLogAdd(`Waiting for other players...`);
        this.gameManager.hudAnnounceAdd(`Waiting for other players...`);
        break;
      case 'start': // TODO: add better state management for recording and leaving rooms
        if (!gameJavascriptContext.isGameRunning) {
          toast.info("Game finished!");
          if (tournamentId === undefined) {
            navigate('/');
          }
        }
        else {
          this.gameManager.hudLogAdd(`Game starts!`);
          this.gameManager.hudAnnounceAdd(`Game starts!`);
          this.props.startRecording.call();
        }
        break;
      case 'stop':
        gameJavascriptContext.gameIsRunning(false);
        this.gameManager.hudLogAdd(`Game ends...`);
        await this.props.stopRecording.call();
        this.stop();
        if (tournamentId === undefined) {
          navigate('/');
        }
        toast.info("Game finished!");
        this.setState({
          showResult: true
        })
        gameJavascriptContext.updateSessionHighScore()
        break;
      case 'restart':
        break;
      case 'joined':
        this.gameManager.hudLogAdd(`"${message.params.name}" joins.`);
        console.log("PLAYER ADDRESS IN GAME", message.params.address);
        console.log("TOURNEY ID", tournamentId);
        console.log("PLAYERS ARRAY", message.params.players);
        const params = {
          playerAddress: message.params.address,
          tournamentId,
          isDead: false,
          isGameRunning: true,
          players: message.params.players,
          endsAt: message.params.endTimeScore
        }

        await gameJavascriptContext.initiateGame(params);
        break;
      case 'killed':
        this.gameManager.hudLogAdd(`"${message.params.killerName}" kills "${message.params.killedName}".`);
        gameJavascriptContext.gameIsRunning(false);
        gameJavascriptContext.playerIsDead(true);
        this.stop();
        this.setState({
          showResult: true
        })
        if (tournamentId === undefined) {
          navigate('/');
        }
        toast.info("Game finished!");
        gameJavascriptContext.updateSessionHighScore()
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
    const { gameJavascriptContext } = this.props;
    const newShow = !show
    this.setState({
      showResult: newShow
    })
    if (!newShow && gameJavascriptContext.isGameRunning) {
      navigate('/');
      /*
      if (!playingTournament) {
        navigate('/');
      } else {
        navigate(`/tournaments`)
      }
      const { tournamentId } = this.state
      const playingTournament = !!tournamentId
      */
    }
  }

  // RENDER
  render() {
    const { showResult, recordFileHash,
      tournamentId, viewOnly } = this.state
    const { drizzle, drizzleState, contractMethodSendWrapper, gameJavascriptContext } = this.props

    console.log("The Session ID is", gameJavascriptContext.sessionId);
    console.log("The Game is over?", !gameJavascriptContext.isGameRunning);

    return (
      <GameSceneContainer when={gameJavascriptContext.isGameRunning} viewOnly={viewOnly} tournamentId={tournamentId}>
        <Helmet>
          <title>{`Death Match (${this.state.playersCount})`}</title>
        </Helmet>

        <div ref={this.gameCanvas} />

        {(gameJavascriptContext.isPlayerDead || !gameJavascriptContext.isGameRunning) && tournamentId && (
          <GameResult
            show={showResult}
            onToggle={this.onResultToggle}
            playerAddress={drizzleState.accounts[0]}
            gameSessionId={(!gameJavascriptContext.isGameRunning && gameJavascriptContext.sessionId) || null}
            recordFileHash={recordFileHash}
            tournamentId={tournamentId}
            drizzle={drizzle}
            drizzleState={drizzleState}
            contractMethodSendWrapper={contractMethodSendWrapper}
            didWin={!gameJavascriptContext.isPlayerDead}
          />
        )}

        {isMobile && this.renderJoySticks()}
        {
          // <video id="recorded" loop></video>
        }
        { //tournamentId && (
              //<TournamentResultsCard
                //tournamentId={tournamentId}
                //drizzle={drizzle}
                //playerAddress={drizzleState.accounts[0]}
              ///>
            /*)*/}
      </GameSceneContainer>
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