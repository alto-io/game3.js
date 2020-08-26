import React, { Component, Fragment } from 'react';
import { Router } from '@reach/router';

import { RouteComponentProps } from '@reach/router';
import { Database } from '@game3js/common';

import { localSaveReplay, clientSaveTournamentReplay } from "../helpers/database";

import Game from './Game';
import GameUnity from './GameUnity';
import TournamentResultsCard from '../components/TournamentResultsCard';

import CSS from 'csstype';

declare global {
  interface Window { MediaRecorder: any; }
}

interface IProps extends RouteComponentProps {
  playerProfile: Database.PlayerProfile;
  address: any;
  drizzle: any;
  drizzleState: any;
  contractMethodSendWrapper: any;
}
  
  interface IState {
    stateVar: any;
  }

  const INITIAL_STATE: IState = {
    stateVar: { value: "someValue"},
  };
  
// external functions
function functionExample(someVar) {
    
}

export default class GameContainer extends Component<IProps, IState> {
    
    public state: IState = {
        stateVar: null,
      };

    private mediaRecorder: any;
    private recordedBlobs: any;
    private canvas: any;
    private stream: any;

    constructor(props: any) {
      super(props);
      this.state = {
          ...INITIAL_STATE
      };

      this.startRecording = this.startRecording.bind(this);
      this.stopRecording = this.stopRecording.bind(this);
  }

  // HANDLERS: Gameplay Recorder
  startRecording = async (params) => {
    this.canvas = document.querySelector('canvas');
  
    if (this.canvas) {
      this.stream = this.canvas.captureStream(); // frames per second
      console.log('Started stream capture from canvas element: ', this.stream);
    }

    this.recordedBlobs = [];

    let options: any = { mimeType: 'video/webm' };
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
    const playerId = this.state.playerId || 'player';
    const tournamentId = this.state.tournamentId || 'demo';
    const time = Date.now(); // this.gameManager.gameEndsAt - Date.now();

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
      const recordFileHash = await clientSaveTournamentReplay(file);
      this.setState({
        recordFileHash
      })
      //const resultId = 1
      //const result = await putTournamentResult(tournamentId, resultId, fileHash);
      //console.log(result)
    }
}  
    // METHODS
    // updateSomething = () => {

    // }

    // RENDER
    render() {
      const { drizzle, drizzleState, contractMethodSendWrapper } = this.props
        return (
<<<<<<< HEAD
            <>
              <OutplayGameNavigation />
              <Router>
                <Game
                  path=":roomId"
                  startRecording={this.startRecording}
                  stopRecording={this.stopRecording}
                  drizzle={drizzle}
                  drizzleState={drizzleState}
                  contractMethodSendWrapper={contractMethodSendWrapper}
                />
                <GameUnity
                  path="wom"
                  startRecording={this.startRecording}
                  stopRecording={this.stopRecording}
                  drizzle={drizzle}
                  drizzleState={drizzleState}
                  contractMethodSendWrapper={contractMethodSendWrapper}
                />
            </Router>
          </>
=======
          <Router>
            <Game
              path=":roomId"
              startRecording={this.startRecording}
              stopRecording={this.stopRecording}
              drizzle={drizzle}
              drizzleState={drizzleState}
              contractMethodSendWrapper={contractMethodSendWrapper}
            />
            <GameUnity
              path="wom"
              startRecording={this.startRecording}
              stopRecording={this.stopRecording}
              drizzle={drizzle}
              drizzleState={drizzleState}
              contractMethodSendWrapper={contractMethodSendWrapper}
            />
            <GameUnity
              path="flappybird"
              startRecording={this.startRecording}
              stopRecording={this.stopRecording}
              drizzle={drizzle}
              drizzleState={drizzleState}
              contractMethodSendWrapper={contractMethodSendWrapper}
            />

          </Router>
>>>>>>> master
        );
    }
}

const gamescenecontainerDesign: CSS.Properties = {
  background: '#EEEEEE',
  display: 'flex',
}