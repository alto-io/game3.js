import React from "react";
import Unity, { UnityContent } from "react-unity-webgl";
import fscreen from 'fscreen'
import { Box, Button, IListItem, Inline, Input, Room, Replay, Select, Separator, Space, View } from '../components';
import GameSceneContainer from '../components/GameSceneContainer';
import styled from 'styled-components';
import { Card } from "rimble-ui";
import { DEFAULT_GAME_DIMENSION } from '../constants'
import { Constants } from '@game3js/common';
import { makeNewGameSession, getGameNo, getGameSessionId, updateSessionScore, updateGameNo, createSessionId } from '../helpers/database';

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

interface IProps extends RouteComponentProps {
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
    window.addEventListener('resize', this.handleResize, false);
    window.addEventListener('orientationchange', this.handleResize, false);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize, false);
    window.removeEventListener('orientationchange', this.handleResize, false);
  }

  unityElement: any = null

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
    };

    this.unityElement = React.createRef();

    this.initializeUnity();
    this.preparePlayButton();
  }

  handleResize = () => {
    const widthToHeight =  DEFAULT_GAME_DIMENSION.width / DEFAULT_GAME_DIMENSION.height;
    let newWidth = window.innerWidth;
    let newHeight = window.innerHeight;
    let newWidthToHeight = newWidth / newHeight;
    let height = newHeight;
    let width = newWidth;

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

  speed = 30;
  unityContent = null as any;
  gameEnd = new Event('gameend');

  preparePlayButton = async () => {
    try {
      await this.getBlockchainInfo(this.props);
      await this.fetchGameNo(this.props.address, this.props.tournamentId);
    } catch (e) {
      console.log(e)

    }

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
        this.unityContent.send("Game3JsManager", "SetLevel",
          this.state.selectedLevel ? this.state.selectedLevel : "French Southern and Antarctic Lands");
        this.unityContent.send("Game3JsManager", "StartGame", "start");
        this.setState({ gameName: Constants.WOM });
        break;
      case "flappybird":
        this.unityContent.send("FlappyColyseusGameServerManager", "Connect", gameServerUrl);
        this.unityContent.send("Game3JsManager", "StartGame", "start");
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

    // const updateUser = this.context.updateUser;
    // const response = await this.nakamaServiceInstance.PlayGame();
    // if (response.payload.response)
    // {
    //   updateUser(await this.nakamaServiceInstance.updateAccountDetails());
    //   this.unityContent.send("OutplayManager", "SetLevel",
    //     this.state.selectedLevel ? this.state.selectedLevel : "French Southern and Antarctic Lands");
    //   this.unityContent.send("OutplayManager", "StartGame", "start");
    //   this.eventDispatcher.dispatch(events.game.start);
    // }
    // else {
    //   this.eventDispatcher.dispatch(events.error.insufficientFunds);
    // }
  }

  //   onChangeLevel = async (e) => {
  //     this.setState(
  //       {
  //         selectedLevel: e.target.innerText
  //       }
  //     )
  //   }

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

    this.unityContent = new UnityContent(
      "/" + path + "/unitygame.json",
      "/" + path + "/UnityLoader.js"
    );

    this.unityContent.on("progress", progression => {
      this.setState({ progression })
      console.log("Unity progress", progression);
    });

    this.unityContent.on("loaded", () => {
      console.log("Yay! Unity is loaded!");
    });

    this.unityContent.on("SendEvent", outplayEvent => {
      this.processOutplayEvent(outplayEvent);
    });

    this.unityContent.on("SendString", message => {
      window.alert(message);
      console.log(message);
    });

    this.unityContent.on("SendNumber", rotation => {
      this.setState({ rotation: Math.round(rotation) });
    });

    this.unityContent.on("SendScore", score => {
      this.setState({ score });

      console.log(score)
    });

    this.unityContent.on("SendDoubleTime", doubleTime => {
      this.setState({ doubleTime });

      console.log(doubleTime)
    });



    this.unityContent.on("quitted", () => {
      this.setState({ isGameRunning: false })
    });

    this.unityContent.on("error", () => {
      this.setState({ isGameRunning: false })
    })
  }

  onClickSendToJS() {
    this.unityContent.send("OutplayManager", "ConsoleLog", "Receive Message from Javascript!");
  }

  onClickStart() {
    this.unityContent.send("Cube", "StartRotation");
  }

  onClickStop() {
    this.unityContent.send("Cube", "StopRotation");
  }

  onClickUpdateSpeed(speed) {
    this.speed += speed;
    this.unityContent.send("Cube", "SetRotationSpeed", this.speed);
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
      })
    }
  }

  onClickUnount() {
    this.setState({ unityShouldBeMounted: false });
  }

  render() {
    const { isGameRunning, gameReady, playBtnText, progression, 
      width, height, pseudoFullscreen } = this.state;
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
          disabled={!gameReady}
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
                    unityContent={this.unityContent}
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
                  {'⛶'}
                </Button>
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
