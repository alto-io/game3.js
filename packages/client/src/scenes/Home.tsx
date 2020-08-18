import { navigate, RouteComponentProps } from '@reach/router';
import { Constants, Types, Database } from '@game3js/common';
import React, { Component, Fragment } from 'react';
import { Helmet } from 'react-helmet';
import { Box, Button, IListItem, Inline, Input, Room, Replay, Select, Separator, Space, View } from '../components';

import { Flex, Text } from "rimble-ui";

import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import { updatePlayerProfile, refreshLeaderboard, getFileFromHash } from "../helpers/database";

import styled from "styled-components";
import { colors } from "../styles";

import { Client } from 'colyseus.js';
import { RoomAvailable } from 'colyseus.js/lib/Room';
import qs from 'querystringify';
import playerImage from '../images/textures/player/player-idle-2.png';

import Body from '../components/Body'

const SAccountName = styled.div`
  margin: 1em 0;
  color: rgb(${colors.black});
  t-size: 20px;
  font-weight: 700;
`;


const MapsList: IListItem[] = Constants.MAPS_NAMES.map(value => ({
  value,
  title: value,
}));

const PlayersCountList: IListItem[] = Constants.ROOM_PLAYERS_SCALES.map(value => ({
  value,
  title:  `${value} ` + ((value === 1) ? `player` : `players`),
}));

const GameModesList: IListItem[] = Constants.GAME_MODES.map(value => ({
  value,
  title: value,
}));


const ALLOW_NAME_CHANGE = true;

interface IProps extends RouteComponentProps {
  playerProfile: Database.PlayerProfile;
  connected: boolean;
  drizzle: any;
  drizzleState: any;
  contractMethodSendWrapper: any;
}

interface IState {
  newPlayerName: string;
  playerName: string;
  hasNameChanged: boolean;
  leaderboard: Array<Database.LeaderboardEntry>;
  timer: any;
  leaderboardTimer: any;

  isNewRoom: boolean;
  roomName: string;
  roomMap: any;
  roomMaxPlayers: any;
  mode: any;
  rooms: Array<RoomAvailable<any>>;

  replayingVideo: boolean;
}

export default class Home extends Component<IProps, IState> {

  public state: IState = {
    newPlayerName: null,
    playerName: '',
    hasNameChanged: false,
    leaderboard: null,

    timer: null,
    leaderboardTimer: null,

    isNewRoom: false,
    roomName: localStorage.getItem('roomName') || '',
    roomMap: MapsList[0].value,
    roomMaxPlayers: PlayersCountList[0].value,
    mode: GameModesList[0].value,
    rooms: [],

    replayingVideo: false
  };

  private client?: Client;
  private video: any;
  
  // BASE
  componentDidMount() {
    try {
      const host = window.document.location.host.replace(/:.*/, '');
      const port = process.env.NODE_ENV !== 'production' ? Constants.WS_PORT : window.location.port;
      const url = window.location.protocol.replace('http', 'ws') + "//" + host + (port ? ':' + port : '');

      this.client = new Client(url);
      this.setState({
        timer: setInterval(this.updateRooms, Constants.ROOM_REFRESH),
      }, this.updateRooms);

      this.setState({
        leaderboardTimer: setInterval(this.updateLeaderboard, Constants.ROOM_REFRESH),
      }, this.updateLeaderboard);

    } catch (error) {
      console.error(error);
    }
  }

  componentWillUnmount() {
    const {
      timer,
      leaderboardTimer
    } = this.state;

    if (timer) {
      clearInterval(timer);
    }

    if (leaderboardTimer) {
      clearInterval(leaderboardTimer);
    }

  }


  // HANDLERS
  handlePlayerNameChange = (event: any) => {
    this.setState({
      playerName: event.target.value,
      hasNameChanged: true,
    });

  }

  handleNameSave = () => {
    const { playerName } = this.state;
    // localStorage.setItem('playerName', playerName);

    this.props.playerProfile.username = playerName;

    updatePlayerProfile(this.props.playerProfile)

    this.setState({
      newPlayerName: playerName,
      playerName: '',
      hasNameChanged: false,
    });


    toast.info('👋 Nice to meet you, ' + playerName + '!');
  }

  handleRoomNameChange = (event: any) => {
    const roomName = event.target.value;
    localStorage.setItem('roomName', roomName);
    this.setState({
      roomName,
    });
  }

  handleRoomClick = (roomId: string) => {
    navigate(`/${roomId}`);
  }

  handlePlayWomClick = (roomId: string) => {
    navigate(`/wom`);
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

  handleCreateRoomClick = () => {
    const {
      roomName,
      roomMap,
      roomMaxPlayers,
      mode,
    } = this.state;

    const playerName = this.props.playerProfile.username

    const options: Types.IRoomOptions = {
      playerName,
      roomName,
      roomMap,
      roomMaxPlayers,
      mode,
    };

    console.log(options);

    navigate(`/new${qs.stringify(options, true)}`);
  }

  handleCancelRoomClick = () => {
    this.setState({
      isNewRoom: false,
    });
  }



    // METHODS
    updateRooms = async () => {
      if (!this.client) {
        return;
      }
  
      const rooms = await this.client.getAvailableRooms(Constants.ROOM_NAME);
      this.setState({
        rooms,
      });
    }

    updateLeaderboard = async () => { 
      const leaderboard =  await refreshLeaderboard();

      // format leaderboard for render

      this.setState({
        leaderboard,
      });
    }    
  
  // RENDER
  render() {
    const { drizzle, drizzleState, contractMethodSendWrapper } = this.props
    return (
      <>

          <Body drizzle={drizzle} drizzleState={drizzleState} contractMethodSendWrapper={contractMethodSendWrapper} />



          {    
                  <View
                    flex={true}
                    center={true}
                    style={{
                      padding: 32,
                      flexDirection: 'column',
                    }}
                  >

                    <Helmet>
                      <title>{Constants.APP_TITLE}</title>
                    </Helmet>

                    <View flex={true} center={true} column={true}>
                    {
                      // <h1 style={{ color: 'white' }}>
                      //   {Constants.APP_TITLE}
                      // </h1>
                      // <Space size="xxs" />
                      // <GitHub />
                    }
                    </View>

                    {
                      this.renderReplayVideo()
                    }

                    {
                      this.props.connected &&
                      <>
                        {
                          this.renderName()
                        }
                      </>
                    }

                    <Space size="m" />

                    <Box
                      style={{
                        width: 500,
                        maxWidth: '100%',
                      }}
                    >
                    {this.renderLeaderboard()}
                    </Box>

                    <Space size="m" />
                    {this.renderRoom()}

                  </View>
            }
      </>);
  }


  renderReplayVideo = () => {
    // const {
    //   replayingVideo,
    // } = this.state; 

    // if (!replayingVideo)
    // {
    //   return null;
    // }

    return (
      <Fragment>
           <video id="recorded" loop></video>
      </Fragment>
    )
  }

  renderName = () => {
    return (
      <Box
        style={{
          width: 500,
          maxWidth: '100%',
        }}
      >
        <View flex={true}>
          <Inline size="thin" />
          <SAccountName>Pick your name:</SAccountName>
        </View>
        <Space size="xs" />

        {ALLOW_NAME_CHANGE && (
          <Input
            value={this.state.playerName}
            placeholder={this.state.newPlayerName ? this.state.newPlayerName : this.props.playerProfile.username}
            maxLength={Constants.PLAYER_NAME_MAX}
            onChange={this.handlePlayerNameChange}
          />
        )}

        {this.state.hasNameChanged && (
          <Fragment>
            <Space size="xs" />
            <Button
              title="Save"
              onClick={this.handleNameSave}
              text={'Save'}
            />
          </Fragment>
        )}
      </Box>
    );
  }

  renderLeaderboard = () => {
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

    


    // for (const entry in leaderboard)
    // {
    //   return (
    //     {entry}
    //   )
    // }

    // return leaderboard.map(({ roomId, metadata, clients, maxClients }, index) => {
    //   const map = MapsList.find(item => item.value === metadata.roomMap);
    //   const mapName = map ? map.title : metadata.roomMap;
    //
    //   return (
    //     <Fragment key={roomId}>
    //       <Room
    //         id={roomId}
    //         roomName={metadata.roomName}
    //         roomMap={mapName}
    //         clients={clients}
    //         maxClients={maxClients}
    //         mode={metadata.mode}
    //         onClick={this.handleRoomClick}
    //       />
    //       {(index !== rooms.length - 1) && <Space size="xxs" />}
    //     </Fragment>
    //   );
    // });
    //

  }

  renderRoom = () => {
    return (
      <Box
        style={{
          width: 500,
          maxWidth: '100%',
        }}
      >
        {this.renderNewRoom()}
        <Space size="xxs" />
        <Separator />
        <Space size="xxs" />
        {this.renderRooms()}
        <Space size="xxs" />
      </Box>
    );
  }

  renderNewRoom = () => {
    const {
      isNewRoom,
      roomName,
      roomMap,
      roomMaxPlayers,
      mode,
    } = this.state;

    return (
      <View
        flex={true}
        style={{
          alignItems: 'flex-start',
          flexDirection: 'column',
        }}
      >

          <Button
            title="Play WoM"
            onClick={this.handlePlayWomClick}
            text={'Play WoM'}
          />

          <Space size="xxs" />

        {!isNewRoom && (
          <Button
            title="Create new room"
            onClick={() => this.setState({ isNewRoom: true })}
            text={'+ New Room'}
          />
        )}
        {isNewRoom && (
          <View style={{ width: '100%' }}>
            {/* Name */}
            <p>Name:</p>
            <Space size="xxs" />
            <Input
              placeholder="Name"
              value={roomName}
              maxLength={Constants.ROOM_NAME_MAX}
              onChange={this.handleRoomNameChange}
            />
            <Space size="s" />

            {/* Map */}
            <p>Map:</p>
            <Space size="xxs" />
            <Select
              value={roomMap}
              values={MapsList}
              onChange={(event: any) => this.setState({ roomMap: event.target.value })}
            />
            <Space size="s" />

            {/* Players */}
            <p>Max players:</p>
            <Space size="xxs" />
            <Select
              value={roomMaxPlayers}
              values={PlayersCountList}
              onChange={(event: any) => this.setState({ roomMaxPlayers: event.target.value })}
            />
            <Space size="s" />

            {/* Mode */}
            <p>Game mode:</p>
            <Space size="xxs" />
            <Select
              value={mode}
              values={GameModesList}
              onChange={(event: any) => this.setState({ mode: event.target.value })}
            />
            <Space size="s" />

            {/* Button */}
            <View>
              <Button
                title="Create room"
                onClick={this.handleCreateRoomClick}
                text={'Create'}
              />
              <Space size="xs" />
              <Button
                title="Cancel"
                onClick={this.handleCancelRoomClick}
                text={'Cancel'}
                reversed={true}
              />
            </View>
          </View>
        )}
      </View>
    );
  }    
    
  renderRooms = () => {
    const {
      rooms,
    } = this.state;

    if (!rooms || !rooms.length) {
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
          {'No rooms yet...'}
        </View>
      );
    }

    return rooms.map(({ roomId, metadata, clients, maxClients }, index) => {
      const map = MapsList.find(item => item.value === metadata.roomMap);
      const mapName = map ? map.title : metadata.roomMap;

      return (
        <Fragment key={roomId}>
          <Room
            id={roomId}
            roomName={metadata.roomName}
            roomMap={mapName}
            clients={clients}
            maxClients={maxClients}
            mode={metadata.mode}
            onClick={this.handleRoomClick}
          />
          {(index !== rooms.length - 1) && <Space size="xxs" />}
        </Fragment>
      );
    });
  }    
  
}
