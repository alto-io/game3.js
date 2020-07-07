import React, { Component } from 'react'
import { RouteComponentProps } from '@reach/router'

import styled from 'styled-components'
import { format, isPast } from 'date-fns'

import { colors } from "../styles"

import { View, Button } from '../components'
import { TOURNAMENT_STATE_DRAFT, TOURNAMENT_STATE_ACTIVE, 
  TOURNAMENT_STATE_ENDED } from '../constants'

import TournamentResult from './TournamentResult'

const SRed = styled.div`
  color: rgb(${colors.red});
  margin-left: 1em;
`;

interface IProps extends RouteComponentProps {
  tournament?: any,
  own?: boolean,
  web3?: any,
  onActivate?: any,
  onPlay?: any,
  onPlayResult?: any,
  onDeclareWinner?: any,

  userAddress?: any,
  contract?: any,
  tournamentId?: any,
  showOwn?: boolean,
}

interface IState {
  tournament?: any,
  ownTournament?: any
}

class Tournament extends Component<IProps, IState> {
  constructor(props) {
    super(props)

    this.state = {
      tournament: null,
      ownTournament: false
    }
  }

  componentDidMount() {
    this.getBlockchainInfo()
  }

  getBlockchainInfo = async () => {
    const { tournamentId, contract, userAddress } = this.props

    const raw = await contract.methods.getTournament(tournamentId).call()
    const tournament = {
      id: tournamentId,
      organizer: raw['0'],
      endTime: parseInt(raw['1']),
      prize: raw['2'],
      state: parseInt(raw['3']),
      balance: raw['4'],
      timeIsUp: false,
      canDeclareWinner: true,
      results: [],
    }
    tournament.timeIsUp = isPast(new Date(tournament.endTime))

    const ownTournament = tournament.organizer.toLowerCase() === userAddress.toLowerCase()

    const resultsCount = await contract.methods.getResultsCount(tournament.id).call()
    const results = []
    for (let resultIdx = 0; resultIdx < resultsCount; resultIdx++) {
      const rawResult = await contract.methods.getResult(tournament.id, resultIdx).call()
      results.push({
        tournamentId: tournament.id,
        resultId: resultIdx,
        isWinner: rawResult['0'],
        playerAddress: rawResult['1'],
        fileHash: rawResult['2'],
      })
    }
    tournament.results = results
    tournament.canDeclareWinner = results.find(r => r.isWinner) === null

    this.setState({
      tournament,
      ownTournament
    })
  }

  render () {
    const { onActivate, onPlay, web3, onPlayResult, onDeclareWinner, showOwn } = this.props
    const { tournament, ownTournament } = this.state

    const hasTournament = !!tournament

    if (!hasTournament) {
      return (
        <View
        flex={true}
        style={{
          color: 'darkgrey',
          width: '100%',
          marginTop: '10px',
          marginBottom: '10px',
        }}
      >
        Loading...
      </View>
      )
    }

    if (hasTournament && (ownTournament !== showOwn)) {
      return (null)
    }

    const canActivate = ownTournament && tournament.state === TOURNAMENT_STATE_DRAFT
    const isActive = tournament.state === TOURNAMENT_STATE_ACTIVE
    const canPlay = !ownTournament && isActive && !tournament.timeIsUp

    const prizeStr = `${web3.utils.fromWei(tournament.prize)} ETH`
    const endTimeStr = format(new Date(tournament.endTime),
      'MMM d, yyyy, HH:mm:ss')

    let results = []
    if (ownTournament) {
      results = tournament.results.map(result =>
        <TournamentResult
          result={result}
          onPlayResult={onPlayResult}
          onDeclareWinner={onDeclareWinner}
          canDeclareWinner={tournament.canDeclareWinner}
        />)
    }

    return (
      <View
        flex={true}
        style={{
          color: 'darkgrey',
          width: '100%',
          marginTop: '10px',
          marginBottom: '10px',
        }}
      >
        <View flex={true} column={true} style={{ alignItems: 'left' }}>
          <View flex={true}>
            Prize: {prizeStr}
          </View>
          <View flex={true} >
            End time: {endTimeStr} {tournament.timeIsUp && (<SRed>(Time is up)</SRed>)}
          </View>
          <View flex={true} >
            Winner declared: {(!tournament.canDeclareWinner).toString()}
          </View>
          { ownTournament && (
            <View flex={true} column={true} style={{ alignItems: 'left' }}>
              { results }
            </View>
          )}
        </View>
        <View flex={true} style={{ flexGrow: 1 }} ><div/></View>
        {canActivate && (
          <View flex={true}>
            <Button
              title="Activate Tournament"
              onClick={() => {onActivate(tournament)}}
              text={'Activate'}
            />
          </View>
        )}
        {canPlay && (
          <View flex={true}>
            <Button
              title="Play"
              onClick={() => {onPlay(tournament)}}
              text={'Play'}
            />
          </View>
        )}
      </View>
    )
  }
}

export default Tournament