import React, { Component, Fragment } from 'react';
import { drizzleConnect } from "@drizzle/react-plugin";
import { Box, Flex, Text, Link, Flash } from "rimble-ui";
import { Button, IListItem, Inline, Input, Room, Replay, Select, Separator, Space, View } from '../components';
import { Constants, Types, Database } from '@game3js/common';

import { updatePlayerProfile, refreshLeaderboard, getFileFromHash } from "../helpers/database";
import { navigate, RouteComponentProps } from '@reach/router';

import PlayerTournamentResults from "./PlayerTournamentResults";

interface IState {
  leaderboard: Array<Database.LeaderboardEntry>;
  replayingVideo: boolean;
  leaderboardTimer: any;  
}

class DashboardView extends Component<any, IState> {

  public state: IState = {
    leaderboard: null,
    replayingVideo: false,
    leaderboardTimer: null    
  };

  private video: any;

 // BASE
 componentDidMount() {
  try {
    this.setState({
      leaderboardTimer: setInterval(this.updateLeaderboard, Constants.ROOM_REFRESH),
    }, this.updateLeaderboard);

    } catch (error) {
      console.error(error);
    }
  }

  updateLeaderboard = async () => { 
    const leaderboard =  await refreshLeaderboard();

    // format leaderboard for render

    this.setState({
      leaderboard,
    });
  }  

  handleReplayClick = async (hash: string) => {

    // start reading the file from DB
    const replayFile = await getFileFromHash(hash);

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

  renderReplays = () => {
    const {
      leaderboard,
    } = this.state;

    if (!leaderboard) {
      return (
        <View
          flex={true}
          center={true}
          style={{
            borderRadius: 8,
            backgroundColor: '#efefef',
            color: 'darkgrey',
            height: 128,
          }}
        >
          {'Refreshing Leaderboard attempts...'}
        </View>
      );
    }

    if (leaderboard.length <= 0) {
      return (
        <View
          flex={true}
          center={true}
          style={{
            borderRadius: 8,
            backgroundColor: '#efefef',
            color: 'darkgrey',
            height: 128,
          }}
        >
          {'No entries yet, start a game to join'}
        </View>
      );
    }

    

    return leaderboard.map(({time, id, hash}, index) => {
      return (
        <Fragment key={id}>
          <Replay
            id={id}
            time={time}
            hash={hash}
            onClick={this.handleReplayClick}
          />
          {(index !== leaderboard.length - 1) && <Space size="xxs" />}
        </Fragment>

     )
    });
  }

    render() {
      
      return (
        <Box maxWidth={"1180px"} p={3} mx={"auto"}>
          {this.props.account && this.props.accountValidated ? (
            <PlayerTournamentResults drizzle={this.props.drizzle} account={this.props.account}/>
          ) : (
            <Flash> You have to be logged in to view. </Flash>
          )}
          
          {/* <Text my={4} />
          <Flex justifyContent={"space-between"} mx={-3} flexWrap={"wrap"}>
          Your Game Replays
          </Flex>
          <Flex justifyContent={"space-between"} mx={-3} flexWrap={"wrap"}>
            <video id="recorded" loop></video>                
          </Flex>

          <Box
            style={{
              width: 500,
              maxWidth: '100%',
            }}
          >
          {this.renderReplays()}
          </Box>                 */}
        </Box>  
      );
      }

}
/*
 * Export connected component.
 */
const mapStateToProps = state => {
    return {
    };
  };
  
  export default drizzleConnect(DashboardView, mapStateToProps);