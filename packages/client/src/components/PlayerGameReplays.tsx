import React, { Component, Fragment } from "react";
import { Box, Flex, Text } from "rimble-ui";
import { Replay, Space, View } from "../components";
import { Constants, Database } from "@game3js/common";
import { refreshLeaderboard, getFileFromHash } from "../helpers/database";
import styled from 'styled-components';

interface IState {
  leaderboard: Array<Database.LeaderboardEntry>;
  replayingVideo: boolean;
  leaderboardTimer: any;
  loadingReplay: boolean;
}

const VideoContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
`;

const VideoPlayer = styled.video`
  width: 100%;
  height 80%;
`

const LoadingText = styled.p`
  font-family: 'Apercu Bold', sans-serif;
  font-weight: bold;
`

class PlayerGameReplays extends Component<any, IState> {
  private video: any;

  constructor(props) {
    super(props);

    this.state = {
      leaderboard: null,
      replayingVideo: false,
      leaderboardTimer: null,
      loadingReplay: false,
    }
  }

  // BASE
  async componentDidMount() {
    // try {
    //   this.setState({
    //     leaderboardTimer: setInterval(this.updateLeaderboard, Constants.ROOM_REFRESH),
    //   }, this.updateLeaderboard);

    //   } catch (error) {
    //     console.error(error);
    //   }
    if (this.props.hash) {
      console.log("PLAYER REPLAY: Hash 1", this.props.hash);
      await this.handleReplayClick(this.props.hash);
    }
  }

  async componentWillReceiveProps(nextProps) {
    if (this.props.hash !== nextProps.hash) {
      console.log("PLAYER REPLAY: Hash 2", nextProps.hash);
      await this.handleReplayClick(nextProps.hash);
    }
  }

  componentWillUnmount() {
    if (this.video) {
      console.log("PLAYER REPLAY: Replay stopped");
      this.handleStopVideo();
    }
  }

  updateLeaderboard = async () => {
    const leaderboard = await refreshLeaderboard();

    // format leaderboard for render

    this.setState({
      leaderboard,
    });
  }

  handleStopVideo = () => {
    this.video.pause();
    this.video.currentTime = 0;
    this.setState(
      {
        replayingVideo: false
      }
    )
  }

  handleReplayClick = async (hash: string) => {
    const {replayingVideo} = this.state;

    this.setState({loadingReplay: true});
    // start reading the file from DB
    const replayFile = await getFileFromHash(hash);

    this.setState({loadingReplay: false});

    const url = window.URL.createObjectURL(replayFile);

    this.video = document.querySelector('video');
    this.video.src = url;
    this.video.play();

    this.setState(
      {
        replayingVideo: true
      }
    )
  }

  render() {
    const {loadingReplay} = this.state;
    return (
      <VideoContainer>
        {loadingReplay ? (<LoadingText>Loading Replay...</LoadingText>) : 
        (<VideoPlayer id="recorded" loop></VideoPlayer>)}
      </VideoContainer>
    )
  }
}

export default PlayerGameReplays;
