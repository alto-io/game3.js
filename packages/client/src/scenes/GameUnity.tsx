import React from "react";
import Unity, { UnityContent } from "react-unity-webgl";
import { Box, Button, IListItem, Inline, Input, Room, Replay, Select, Separator, Space, View } from '../components';
import GameSceneContainer from '../components/GameSceneContainer';
import { Card } from "rimble-ui";
import { DEFAULT_GAME_DIMENSION } from '../constants'

interface IProps extends RouteComponentProps {
  roomId?: string;
  drizzle?: any;
  drizzleState?: any;
  startRecording: any;
  stopRecording: any;
  contractMethodSendWrapper?: any;
  isGameRunning?: boolean;
}

export class GameUnity extends React.Component<IProps, any> {

  constructor(props) {
    super(props);
    this.state = {
      rotation: 0,
      unityShouldBeMounted: true,
      gameReady: false,
      selectedLevel: false,
      isGameRunning: false
    };

    this.initializeUnity();
  }

  speed = 30;
  unityContent = null as any;

  onPlayGame = async (e) => {

    this.unityContent.send("OutplayManager", "SetLevel",
    this.state.selectedLevel ? this.state.selectedLevel : "French Southern and Antarctic Lands");
    this.unityContent.send("OutplayManager", "StartGame", "start");
    this.props.startRecording.call(null, "wom");
    
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


  processOutplayEvent = (outplayEvent) => {

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
          this.setState({ isGameRunning: false });
      break;
        case 'GameEndSuccess':
          this.setState({ isGameRunning: false });
      break;

    }

    console.log(outplayEvent);
    // send out an event
    // this.eventDispatcher.dispatch(outplayEvent);
  }

  initializeUnity() {
    // load unity from the same server (public folder)
    this.unityContent = new UnityContent(
      "/unitygame.json",
      "/UnityLoader.js"
    );

    this.unityContent.on("progress", progression => {
      this.setState({isGameRunning: true})
      console.log("Unity progress", progression);
    });

    this.unityContent.on("loaded", () => {
      console.log("Yay! Unity is loaded!");

      //// BUG: React doesn't like to render state change on new accounts :(
      this.setState(
        {
          gameReady: true,
          isGameRunning: true
        }
      );
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

    this.unityContent.on("quitted", () => {
      this.setState({isGameRunning: false})
    });

    this.unityContent.on("error", () => {
      this.setState({isGameRunning: false})
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
    const { isGameRunning } = this.state;
    return (
      <GameSceneContainer when={isGameRunning}>
        <Button
          block
          disabled={!this.state.gameReady}
          className="mb-3"
          color="primary"
          type="button"
          onClick={this.onPlayGame}
        >
        {
          this.state.gameReady ?
          "Play Game (100 💎)" :
          "Loading Game ..."
        }
        </Button>

        <Space size="xxs" />
        <div style={{width:`${DEFAULT_GAME_DIMENSION.width}px`, height:`${DEFAULT_GAME_DIMENSION.height}px`}}>
          {
            this.state.unityShouldBeMounted === true && (
              <Unity width="100%" height="100%" unityContent={this.unityContent} />
            )
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
