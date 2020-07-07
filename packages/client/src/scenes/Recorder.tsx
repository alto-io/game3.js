import React, { Component, Fragment } from 'react';
import { RouteComponentProps } from '@reach/router';
import { main } from '../temp/demo';


declare global {
    interface Window { MediaRecorder: any; }
}

interface IProps extends RouteComponentProps {
    propVar: any;
  }
  
  interface IState {
    stateVar: any;
  }


  const INITIAL_STATE: IState = {
    stateVar: { value: "someValue"},
  };


export default class Recorder extends Component<IProps, IState> {
    
    private mediaRecorder: any;
    private recordedBlobs: any;
    private sourceBuffer: any;
    private video: any;
    private canvas: any;
    private stream: any;
    private mediaSource: any;
    private recordButton: HTMLElement;
    private playButton: HTMLElement;
    private downloadButton: HTMLElement;

    public state: IState = {
        stateVar: null,
      };      

    constructor(props: any) {
        super(props);
        this.state = {
            ...INITIAL_STATE
        };

        this.toggleRecording = this.toggleRecording.bind(this);
        this.play = this.play.bind(this);
        this.download = this.download.bind(this);

    }
          
    // BASE
    componentDidMount() {
        this.mediaSource = new window.MediaSource();
        this.mediaSource.addEventListener('sourceopen', this.handleSourceOpen, false);
      
        this.canvas = document.querySelector('canvas');
        this.video = document.querySelector('video');
      
        main()

        this.stream = this.canvas.captureStream(); // frames per second
        console.log('Started stream capture from canvas element: ', this.stream);
        
        this.recordButton = document.querySelector('button#record');
        this.playButton = document.querySelector('button#play');
        this.downloadButton = document.querySelector('button#download');
        this.recordButton.onclick = this.toggleRecording;
        this.playButton.onclick = this.play;
        this.downloadButton.onclick = this.download;        
    }

    // HANDLERS

    // METHODS
    handleSourceOpen(event) {
        console.log('MediaSource opened');
        this.sourceBuffer = this.mediaSource.addSourceBuffer('video/webm; codecs="vp8"');
        console.log('Source buffer: ', this.sourceBuffer);
    }
         
    toggleRecording() {
        console.log(this.recordButton)
        if (this.recordButton.textContent === 'Start Recording') {
            this.startRecording();
        } else {
            this.stopRecording();
            this.recordButton.textContent = 'Start Recording';
            (this.playButton as HTMLInputElement).disabled = false;
            (this.downloadButton as HTMLInputElement).disabled = false;
        }
    }
    
    // The nested try blocks will be simplified when Chrome 47 moves to Stable
    startRecording() {
        let options:any = { mimeType: 'video/webm' };
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
        this.recordButton.textContent = 'Stop Recording';
        (this.playButton as HTMLInputElement).disabled = true;
        (this.downloadButton as HTMLInputElement).disabled = true;
        this.mediaRecorder.onstop = (event) => {
            console.log('Recorder stopped: ', event);
            const superBuffer = new Blob(this.recordedBlobs, { type: 'video/webm' });
            this.video.src = window.URL.createObjectURL(superBuffer);
        }

        this.mediaRecorder.ondataavailable = (event) => {
            if (event.data && event.data.size > 0) {
                this.recordedBlobs.push(event.data);
            }
        }

        this.mediaRecorder.start(100); // collect 100ms of data
        console.log('MediaRecorder started', this.mediaRecorder);
    }
    
    stopRecording() {
        this.mediaRecorder.stop();
        console.log('Recorded Blobs: ', this.recordedBlobs);
        this.video.controls = true;
    }
    
    play() {
        this.video.play();
    }
    
    download() {
        const blob = new Blob(this.recordedBlobs, { type: 'video/webm' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = 'test.webm';
        document.body.appendChild(a);
        a.click();
        setTimeout(() => {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        }, 100);
    }


    // RENDER
    render() {
        return (
            <Fragment>


                <canvas></canvas>
                <video id="recorded" loop></video>

                <div>
                    <button id="record">Start Recording</button>
                    <button id="play" disabled>Play</button>
                    <button id="download" disabled>Download</button>
                </div>
              
            </Fragment>

        );
    }
}


// /*
// *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
// *
// *  Use of this source code is governed by a BSD-style license
// *  that can be found in the LICENSE file in the root of the source
// *  tree.
// */

// 'use strict';

// /* globals main */

// // This code is adapted from
// // https://rawgit.com/Miguelao/demos/master/mediarecorder.html

// /* globals main, MediaRecorder */


// // Start the GL teapot on the canvas
// main();

// const stream = canvas.captureStream(); // frames per second
// console.log('Started stream capture from canvas element: ', stream);


