import React, { Component, Fragment } from 'react';
import { navigate, RouteComponentProps } from '@reach/router';
import styled from 'styled-components'
import qs from 'querystringify'

import { colors } from "../styles"

import { Button, View, Box, Separator, Space } from '../components'
import Tournament from '../components/Tournament'
import { Types } from '@game3js/common'

import { getTournamentContract } from '../helpers/web3'
import { getFileFromHash } from "../helpers/database"

const SBold = styled.div`
  margin: 1em 0;
  color: rgb(${colors.black});
  t-size: 20px;
  font-weight: 700;
`;

interface IProps extends RouteComponentProps {
  web3: any,
  address: string,
  playerProfile: any,
}
  
interface IState {
  contract: any,
  tournamentsCount: any,
  ownerView: boolean,
}

const INITIAL_STATE: IState = {
  contract: null,
  tournamentsCount: 0,
  ownerView: false,
}

export default class Tournaments extends Component<IProps, IState> {

  public video: any = null

  constructor(props: any) {
    super(props)

    this.state = {
      ...INITIAL_STATE
    }
  }

  componentDidMount() {
    this.initContract(this.props.web3)
  }

  componentWillReceiveProps(newProps) {
    this.initialize(newProps.web3)
  }

  initialize = async (web3) => {
    await this.initContract(web3)
  }

  initContract = async (web3) => {
    if (!web3) {
      return
    }
    const contract = await getTournamentContract(web3)
    this.setState({ contract }, () => {
      this.updateTournaments()
    })
  }

  updateTournaments = async () => {
    const { contract } = this.state

    const tournamentsCount = await contract.methods.getTournamentsCount().call()
    this.setState({
      tournamentsCount,
    })
  }

  onNewTournament = () => {
    this.createTournament()
  }

  createTournament = async () => {
    const { contract } = this.state
    if (!contract) {
      return
    }
    const { web3, address } = this.props
    const timestamp = Date.now() + 10 * 24 * 60 * 60 * 1000
    const data = ''
    const prize = web3.utils.toBN(1) // TODO

    await contract.methods.createTournament(address, timestamp, data, prize)
      .send({from: address})

    this.updateTournaments()
  }

  onActivate = (tournament) => {
    this.activateTournament(tournament)
  }

  activateTournament = async (tournament) => {
    const { address } = this.props
    const { contract } = this.state

    await contract.methods.activateTournament(tournament.id, tournament.prize)
      .send({
        from: address,
        value: tournament.prize
      })
    this.updateTournaments()
  }

  onPlay = (tournament) => {
    this.startPlaying(tournament)
  }

  startPlaying = (tournament) => {
    const playerName = this.props.playerProfile.username
    const options: Types.IRoomOptions = {
      playerName,
      roomName: 'test-tournament-room',
      roomMap: 'small',
      roomMaxPlayers: 1,
      mode: 'score attack',
      tournamentId: tournament.id,
    };

    navigate(`/new${qs.stringify(options, true)}`)
  }

  showReplay = async (fileHash) => {
    const replayFile = await getFileFromHash(fileHash);

    const url = window.URL.createObjectURL(replayFile);

    this.video = document.querySelector('video');
    this.video.src = url;
    this.video.play();
  }

  declareWinner = async (tournamentId, resultId) => {
    const { address } = this.props
    const { contract } = this.state

    if (!contract) {
      console.log('Missing contract')
      return
    }

    await contract.methods.declareWinner(tournamentId, resultId)
    .send({
      from: address
    })
    this.updateTournaments()
  }

  render() {
    const { tournamentsCount, contract, ownerView } = this.state
    const { web3, address } = this.props

    const noTournaments = tournamentsCount <= 0

    const allTrnsDivs = []
    for(let i = 0; i < tournamentsCount; i++) {
      allTrnsDivs.push(
        <Tournament
          userAddress={address}
          tournamentId={i}
          contract={contract}
          web3={web3}
          onPlay={this.onPlay}
          onActivate={this.onActivate}
          onPlayResult={this.showReplay}
          onDeclareWinner={this.declareWinner}
          showOwn={ownerView}
        />
      )
    }

    return (
      <Fragment>
        <View
          flex={true}
          center={true}
          style={{
            padding: 32,
            flexDirection: 'column',
          }}
        >
          <Fragment>
            <video id="recorded"></video>
          </Fragment>
          <Box
            style={{
              width: 500,
              maxWidth: '100%',
            }}
          >
            { !ownerView && (
              <View
                flex={true}
                style={{
                  alignItems: 'flex-start',
                  flexDirection: 'column',
                }}
              >
                <Button
                  title="To organizer view"
                  onClick={() => {this.setState({ownerView: true})}}
                  text={'To organizer view'}
                />
              </View>
            )}
            { ownerView && (
              <View
                flex={true}
                style={{
                  alignItems: 'flex-start',
                  flexDirection: 'column',
                }}
              >
                <Button
                  title="To player view"
                  onClick={() => {this.setState({ownerView: false})}}
                  text={'To player view'}
                />
              </View>
            )}
            { ownerView && (
              <View
                flex={true}
                style={{
                  alignItems: 'flex-start',
                  flexDirection: 'column',
                }}
              >
                <Button
                  title="Sponsor a tournament"
                  onClick={this.onNewTournament}
                  text={'+ New Tournament'}
                />
              </View>
            )}
            <Space size="xxs" />
            <Separator />
            <Space size="xxs" />
            { noTournaments && (
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
                {'Active tournaments list here'}
              </View>
            )}
            <>
              <View flex={true} style={{ color: 'darkgrey', height: 32 }}>
                {ownerView && (<SBold>My tournaments</SBold>)}
                {!ownerView && (<SBold>Active tournaments</SBold>)}
              </View>
              <Separator />
              <View flex={true} column={true} >
                { allTrnsDivs }
              </View>
            </>
          </Box>
        </View>
      </Fragment>
    )
  }
}