import React from "react";
import Unity, { UnityContext } from "react-unity-webgl";
import fscreen from 'fscreen'
import { Button } from '../components';
import GameSceneContainer from '../components/GameSceneContainer';
import { DEFAULT_GAME_DIMENSION, GAME_DETAILS, 
  ORIENTATION_ANY, ORIENTATION_PORTRAIT, ORIENTATION_LANDSCAPE } from '../constants'
import { Constants } from '@game3js/common';
import { makeNewGameSession, getGameNo, getGameSessionId, updateSessionScore, updateGameNo, createSessionId } from '../helpers/database';
import {ReactComponent as ScreeRotateIcon} from "../images/screen_rotation.svg";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faExpand } from '@fortawesome/free-solid-svg-icons'

const StyledBoxStyle = {
  position: 'relative',
  background: '#fcfcfc',
  borderRadius: '10px',
  boxShadow: '4px 8px 16px rgba(0,0,0,0.25)',
  marginTop: '1.5rem',
}

const FullscreenBoxStyle = {
  position: 'fixed',
  top: '0',
  bottom: '0',
  left: '0',
  right: '0',
  zIndex: '1',
}

interface IProps {
  path: string;
  roomId?: string;
  drizzle?: any;
  drizzleState?: any;
  startRecording: any;
  stopRecording: any;
  contractMethodSendWrapper?: any;
  isGameRunning?: boolean;
  tournamentId: any;
}

export class GameUnity extends React.Component<IProps, any> {
  componentDidMount () {
    const screen = window.screen as any
    screen.lockOrientationUniversal = screen.lockOrientation ||
      screen.mozLockOrientation ||
      screen.msLockOrientation;

    window.addEventListener('resize', this.handleResize, false);
    window.addEventListener('orientationchange', this.handleOrienationChange, false);

    this.preInitialize();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize, false);
    window.removeEventListener('orientationchange', this.handleOrienationChange, false);
  }

  unityElement: any = null
  orientationLockSupported: boolean = false
  neededOrientation: string = ORIENTATION_ANY

  constructor(props) {
    super(props);
    this.state = {
      rotation: 0,
      unityShouldBeMounted: true,
      gameReady: false,
      sessionId: '0',
      playerAddress: props.address,
      tournamentId: props.tournamentId,
      selectedLevel: false,
      isGameRunning: false,
      progression: 0,
      gameNo: 0,
      tournament: null,
      playBtnText: "Play",
      score: 1,
      gameName: '',
      doubleTime: null,
      gameId: '',
      width: '',
      height: '',
      pseudoFullscreen: false,
      orientationOk: true,
    };

    this.orientationLockSupported = false;
    this.unityElement = React.createRef();

    this.initializeUnity();
    this.preparePlayButton();
  }

  handleOrienationChange = () => {
    let orientationOk = false
    // can be locked no need to ask user
    if (!orientationOk && this.orientationLockSupported) {
      orientationOk = true
    }

    const screen = window.screen as any
    let orientation = (screen.orientation || {}).type || screen.mozOrientation || screen.msOrientation 
      || window.orientation;
    if (orientation === 0 || orientation === 180) {
      orientation = ORIENTATION_PORTRAIT
    }
    if (orientation === 90 || orientation === -90) {
      orientation = ORIENTATION_LANDSCAPE
    }

    // can't check it, nothing we can do, allow play
    if (!orientationOk && orientation === undefined) {
      orientationOk = true
    }

    let orientationVal = '';
    if (!orientationOk) {
      [orientationVal] = orientation.split('-');
      // unexpected value, nothing we can do, allow play
      if (orientationVal !== ORIENTATION_PORTRAIT && orientationVal !== ORIENTATION_LANDSCAPE) {
        orientationOk = true
      }
    }

    // actual check
    if (!orientationOk) {
      orientationOk = this.neededOrientation === ORIENTATION_ANY
        || orientationVal === this.neededOrientation
    }

    this.setState({
      orientationOk
    })
    this.handleResize();
  }

  handleResize = () => {
    const widthToHeight =  DEFAULT_GAME_DIMENSION.width / DEFAULT_GAME_DIMENSION.height;
    let newWidth = window.innerWidth;
    let newHeight = window.innerHeight;
    let newWidthToHeight = newWidth / newHeight;
    let height = newHeight;
    let width = newWidth;

    if (fscreen.fullscreenElement) {
      width = window.screen.width;
      height = window.screen.height;
      this.setState({
        height,width
      })
    } else {
      const { pseudoFullscreen } = this.state
      if (pseudoFullscreen) {
        this.setState({
          height,width
        })
      } else {
        if (newWidthToHeight > widthToHeight) {
          newWidth = newHeight * widthToHeight;
          height = newHeight * 0.85;
          width = newWidth * 0.85;
          this.setState({
            height,width
          })
        } else {
          newHeight = newWidth / widthToHeight;
          width = newWidth * 0.85;
          height = newHeight * 0.85;
          this.setState({
            height,width
          })
        }
      }
    }
  }

  speed = 30;
  unityContext = null as any;
  gameEnd = new Event('gameend');

  preparePlayButton = async () => {
    try {
      await this.getBlockchainInfo(this.props);
      await this.fetchGameNo(this.props.address, this.props.tournamentId);
    } catch (e) {
      console.log(e)

    }

  }

  preInitialize = async () => {
    const gameId = this.props.path;
    const gameDetails = GAME_DETAILS.find(detail => detail.route === gameId)
    if (!gameDetails) {
      return
    }

    const screen = window.screen as any;
    this.orientationLockSupported = !!((screen.orientation && typeof screen.orientation.lock === 'function')
      || screen.lockOrientationUniversal);

    this.neededOrientation = gameDetails.screenOrientation;
    this.handleOrienationChange();
  }

  initializeGame = async (playerAddress, tournamentId) => {
    let sessionId = await createSessionId(playerAddress, tournamentId);
    this.setState({
      sessionId
    })
    let payload = this.produceGamePayload('session');
    await makeNewGameSession(this.state.gameName, sessionId, tournamentId, payload);
    await updateGameNo(sessionId, playerAddress, tournamentId);

    console.log("GAME NAME FROM STATE", this.state.gameName)
  }

  getBlockchainInfo = async (props) => {
    try {
      const { tournamentId, drizzle } = props

      const contract = drizzle.contracts.Tournaments;
      const raw = await contract.methods.getTournament(tournamentId).call();
      const data = raw['5'].split(' ').join('').split(",");
      const gameId = data[0];
      const selectedLevel = data[1];
      const maxTries = await contract.methods.getMaxTries(tournamentId).call();


      const tournament = {
        maxTries: parseInt(maxTries)
      }

      this.setState({
        gameId,
        selectedLevel,
        tournament

      })

    } catch (e) {
      console.log(e);
    }
  }

  fetchGameNo = async (account, tournamentId) => {
    const gameSessionId = await getGameSessionId(account, tournamentId);
    const gameNo = await getGameNo(gameSessionId, account, tournamentId);
    const playBtnText = this.state.tournament != null ?
      `Play ( ${typeof gameNo !== "number" ? 0 : gameNo} out of ${this.state.tournament.maxTries} )` :
      'Play';

    console.log(playBtnText)

    this.setState(
      {
        playBtnText,
        gameNo: gameNo,
        sessionId: gameSessionId
      });

  }

  onPlayGame = async (e) => {
    const { playerAddress, tournamentId } = this.state;
    const gameId = this.props.path;
    let gameServerUrl = "ws://localhost:3001";

    console.log(this.state.selectedLevel);

    switch (gameId) {
      case "wom":
        this.unityContext.send("Game3JsManager", "SetLevel",
          this.state.selectedLevel ? this.state.selectedLevel : "French Southern and Antarctic Lands");
        this.unityContext.send("Game3JsManager", "StartGame", "start");
        this.setState({ gameName: Constants.WOM });
        break;
      case "flappybird":
        this.unityContext.send("FlappyColyseusGameServerManager", "Connect", gameServerUrl);
        this.unityContext.send("Game3JsManager", "StartGame", "start");
        this.setState({ gameName: Constants.FP });
        break;
    }

    await this.initializeGame(playerAddress, tournamentId); // should be called here

    if (tournamentId || tournamentId === 0) {
      this.props.startRecording.call();
    }

    this.setState(
      {
        gameReady: false,
        isGameRunning: true
      }
    );
  }

  produceGamePayload = (type: string, didWin?: boolean) => {
    const { gameName, score, playerAddress, doubleTime } = this.state

    if (type === 'score') {
      switch (gameName) {
        case Constants.WOM:
          return {
            score: doubleTime,
            didWin
          }

        case Constants.FP:
          return {
            score
          }
        default:
          break;
      }
    } else if (type === 'session') {
      switch (gameName) {
        case Constants.WOM:
          return {
            playerAddress
          }
        case Constants.FP:
          return {
            playerAddress
          }
        default:
          break;
      }
    }
  }

  handleGameEnd = async (type, didWin) => {
    const { sessionId, playerAddress, tournamentId } = this.state;

    this.fetchGameNo(this.props.address, this.props.tournamentId);
    let payLoad = this.produceGamePayload(type, didWin); // gets appropriate payload
    console.log("GAME UNITY PAYLOAD IN FAIL", payLoad)
    let data = await updateSessionScore(sessionId, playerAddress, tournamentId, payLoad);

    if (tournamentId || tournamentId === 0) {
      await this.props.stopRecording(data.newHighScore);
    }

    dispatchEvent(this.gameEnd);
  }

  processOutplayEvent = async (outplayEvent) => {
    switch (outplayEvent) {
      case 'GameReady':
        this.setState(
          {
            gameReady: true
          }
        );
        break;

      // TODO: add any relevant game end code
      case 'GameEndFail':
        this.setState(
          {
            isGameRunning: false
          }
        );

        this.handleGameEnd('score', false);

        break;
      case 'GameEndSuccess':
        this.setState(
          {
            isGameRunning: false
          }
        );

        this.handleGameEnd('score', true);
        break;

      case 'GameEndSuccessTime':
        this.setState(
          {
            isGameRunning: false
          }
        );

        this.handleGameEnd('score', true);

        break;

    }

    console.log(outplayEvent);
    // send out an event
    // this.eventDispatcher.dispatch(outplayEvent);
  }

  initializeUnity() {
    // load unity from the same server (public folder)
    const path = this.props.path;

    this.unityContext = new UnityContext({
      loaderUrl: "/" + path + "/unitygame.loader.js",
      dataUrl: "/" + path + "/unitygame.data",
      frameworkUrl: "/" + path + "/unitygame.framework.js",
      codeUrl: "/" + path + "/unitygame.wasm",
    });

    this.unityContext.on("progress", progression => {
      this.setState({ progression })
      console.log("Unity progress", progression);
    });

    this.unityContext.on("loaded", () => {
      console.log("Yay! Unity is loaded!");
    });

    this.unityContext.on("SendEvent", outplayEvent => {
      this.processOutplayEvent(outplayEvent);
    });

    this.unityContext.on("SendString", message => {
      window.alert(message);
      console.log(message);
    });

    this.unityContext.on("SendNumber", rotation => {
      this.setState({ rotation: Math.round(rotation) });
    });

    this.unityContext.on("SendScore", score => {
      this.setState({ score });

      console.log(score)
    });

    this.unityContext.on("SendDoubleTime", doubleTime => {
      this.setState({ doubleTime });

      console.log(doubleTime)
    });

    this.unityContext.on("quitted", () => {
      this.setState({ isGameRunning: false })
    });

    this.unityContext.on("error", () => {
      this.setState({ isGameRunning: false })
    })
  }

  onClickSendToJS() {
    this.unityContext.send("OutplayManager", "ConsoleLog", "Receive Message from Javascript!");
  }

  onClickStart() {
    this.unityContext.send("Cube", "StartRotation");
  }

  onClickStop() {
    this.unityContext.send("Cube", "StopRotation");
  }

  onClickUpdateSpeed(speed) {
    this.speed += speed;
    this.unityContext.send("Cube", "SetRotationSpeed", this.speed);
  }

  onClickFullscreen = () => {
    const { pseudoFullscreen } = this.state
    if (fscreen.fullscreenEnabled) {
      if (fscreen.fullscreenElement) {
        fscreen.exitFullscreen();
      } else {
        fscreen.requestFullscreen(this.unityElement.current);
      }
    } else {
      this.setState({
        pseudoFullscreen: !pseudoFullscreen
      }, this.handleResize)
    }

    if (this.neededOrientation !== ORIENTATION_ANY) {
      this.lockOrientation(this.neededOrientation);
    }
  }

  lockOrientation = (orientation) => {
    const screen = window.screen as any
    if (screen.orientation && typeof screen.orientation.lock === 'function') {
      return window.screen.orientation.lock(orientation)
    } else if (screen.lockOrientationUniversal) {
      return new Promise((resolve, reject) => {
        if (screen.lockOrientationUniversal(orientation)) {
          resolve()
        } else {
            reject()
        }
      })
    } else {
      return new Promise((resolve, reject) => reject())
    }
  }

  onClickUnount() {
    this.setState({ unityShouldBeMounted: false });
  }

  render() {
    const { isGameRunning, gameReady, playBtnText, progression, 
      width, height, pseudoFullscreen, orientationOk } = this.state;
    const { tournamentId } = this.props;

    let canvasWidth =  (window.innerWidth <= 950 ? `${width}px` : "100%");
    let canvasHeight = (window.innerWidth <= 950 ? `${height}px` : "100%");

    if (pseudoFullscreen) {
      canvasWidth = '100%';
      canvasHeight = '100%';
    }
    const boxStyle = pseudoFullscreen ? FullscreenBoxStyle : StyledBoxStyle;
    return (
      <GameSceneContainer when={isGameRunning} tournamentId={tournamentId}>
        <Button
          block
          disabled={!gameReady || !orientationOk}
          className="mb-3"
          color="primary"
          type="button"
          onClick={this.onPlayGame}
        >
          {
            isGameRunning ?
              "Game In Progress" :
              gameReady ?
                playBtnText :
                (progression === 1) ?
                  'Waiting for Game Start' :
                  `Loading Game ... ${Math.floor(progression * 100)}%`
          }
        </Button>

          <div ref={this.unityElement} p={0} width={`${width}px`} height={`${height}px`} style={boxStyle} >
            {
              <>
                {this.state.unityShouldBeMounted === true && (
                  <Unity
                    unityContext={this.unityContext}
                    width={canvasWidth}
                    height={canvasHeight}
                    style={{
                      position: 'relative',
                      top: '0px',
                      left: '0px'
                    }}
                  />
                )}
                <Button
                  color="primary"
                  type="button"
                  onClick={this.onClickFullscreen}
                  style={{ 
                    position: 'absolute', 
                    left: '16px', 
                    bottom: '18px',
                    width: '48px',
                    padding: '4px'
                  }}
                >
                  <FontAwesomeIcon icon={faExpand} />
                </Button>
                {!orientationOk && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '0px',
                      left: '0px',
                      right: '0px',
                      bottom: '0px',
                      backgroundColor: 'rgb(55, 90, 127)',
                      opacity: 0.5,
                    }}>
                      <ScreeRotateIcon
                        fill={'white'}
                        height={48}
                        width={48}
                        style={{
                          position: 'absolute',
                          margin: 0,
                          top: '50%',
                          left: '50%',
                          marginRight: '-50%',
                          transform: 'translate(-50%, -50%)',
                        }}
                      />
                    </div>
                )}
              </>
            }
          </div>
      </GameSceneContainer>
    );
  }
}

export default GameUnity;

// <p>{"Rotation: " + this.state.rotation}deg</p>
// <button onClick={this.onClickSendToJS.bind(this)}>{"Send to JS"}</button>
// <button onClick={this.onClickStart.bind(this)}>{"Start"}</button>
// <button onClick={this.onClickStop.bind(this)}>{"Stop"}</button>
// <button onClick={this.onClickUpdateSpeed.bind(this, 10)}>
//   {"Faster"}
// </button>
// <button onClick={this.onClickUpdateSpeed.bind(this, -10)}>
//   {"Slower"}
// </button>
// <button onClick={this.onClickUnount.bind(this)}>
//   {"Unmount (2019.1=>)"}
// </button>
