import React from "react";
import Unity, { UnityContent } from "react-unity-webgl";
import { Box, Button, IListItem, Inline, Input, Room, Replay, Select, Separator, Space, View } from '../components';
import GameSceneContainer from '../components/GameSceneContainer';
import styled from 'styled-components';
import { Card } from "rimble-ui";
import { DEFAULT_GAME_DIMENSION } from '../constants'
import { Constants } from '@game3js/common';
import { makeNewGameSession, getGameNo, getGameSessionId, updateSessionScore, updateGameNo, createSessionId } from '../helpers/database';

const StyledBox = styled.div` 
  background: #fcfcfc;
  border-radius: 10px;
  box-shadow: 4px 8px 16px rgba(0,0,0,0.25);
  height: 100%;
  width: 100%;
  overflow: hidden;
  margin-top: 1.5rem;

  .web-gl canvas#canvas {
    height: 100%;
    width: 100%;
  }
`

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
      gameId: ''
    };

    this.initializeUnity();
    this.preparePlayButton();
  }

  speed = 30;
  unityContent = null as any;

  preparePlayButton = async () => {
    try {
    await this.getBlockchainInfo(this.props);
    await this.fetchGameNo(this.props.address, this.props.tournamentId);
    } catch (e)
    {
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

    // TODO: disable recording for now
    // this.props.startRecording.call(null, gameId);

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

  processOutplayEvent = async (outplayEvent) => {
    const { sessionId, playerAddress, tournamentId, score } = this.state;
    let payLoad = {}
    const gameEnded = new Event('gameend');
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

        this.fetchGameNo(this.props.address, this.props.tournamentId);
        payLoad = this.produceGamePayload('score', false); // gets appropriate payload
        console.log("GAME UNITY PAYLOAD IN FAIL", payLoad)
        await updateSessionScore(sessionId, playerAddress, tournamentId, payLoad);

        dispatchEvent(gameEnded);

        // this.props.stopRecording.call(null, "wom");

        break;
      case 'GameEndSuccess':
        this.setState(
          {
            isGameRunning: false
          }
        );

        this.fetchGameNo(this.props.address, this.props.tournamentId);
        payLoad = this.produceGamePayload('score', true); // gets appropriate payload
        console.log("GAME UNITY PAYLOAD IN SUCCESS", payLoad)
        await updateSessionScore(sessionId, playerAddress, tournamentId, payLoad);

        dispatchEvent(gameEnded);

        // this.props.stopRecording.call(null, "wom");
        break;

      case 'GameEndSuccessTime':
        this.setState(
          {
            isGameRunning: false
          }
        );

        this.fetchGameNo(this.props.address, this.props.tournamentId);
        payLoad = this.produceGamePayload('score', true); // gets appropriate payload
        console.log("GAME UNITY PAYLOAD IN SUCCESS", payLoad)
        await updateSessionScore(sessionId, playerAddress, tournamentId, payLoad);

        dispatchEvent(gameEnded);

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

  onClickUnount() {
    this.setState({ unityShouldBeMounted: false });
  }

  render() {
    const { isGameRunning, gameReady, playBtnText, progression } = this.state;
    const { tournamentId } = this.props;

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

        <StyledBox p={0}>
          {
            this.state.unityShouldBeMounted === true && (
              <Unity width="100%" height="100%" unityContent={this.unityContent} className="web-gl" />
            )
          }
        </StyledBox>
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
