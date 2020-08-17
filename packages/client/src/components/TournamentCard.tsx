import React, { Component } from 'react'
import { drizzleConnect } from "@drizzle/react-plugin"


import { format, isPast } from 'date-fns'
import { Box, Card, Flex } from "rimble-ui";
import { TOURNAMENT_STATE_DRAFT, TOURNAMENT_STATE_ACTIVE } from '../constants'

import TournamentResult from './TournamentResult'
import GameCard from '../components/GameCard'

class TournamentCard extends Component<any, any> {
  constructor(props) {
    super(props)

    this.state = {
      tournament: null,
      ownTournament: false
    }
  }

  componentDidMount() {
    this.getBlockchainInfo(this.props)
  }

  componentWillReceiveProps(newProps) {
    const { tournamentId, address } = this.props
    const { tournamentId: newId, address: newAddress } = newProps

    if (tournamentId !== newId || address !== newAddress) {
      this.getBlockchainInfo(newProps)
    }
  }

  getBlockchainInfo = async (props) => {
    const { tournamentId, drizzle, address } = props

    const contract = drizzle.contracts.Tournaments;
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

    let ownTournament = false
    if (address) {
      ownTournament = tournament.organizer.toLowerCase() === address.toLowerCase()
    }

    const resultsCount = await contract.methods.getResultsCount(tournament.id).call()
    const results = []
    for (let resultIdx = 0; resultIdx < resultsCount; resultIdx++) {
      const rawResult = await contract.methods.getResult(tournament.id, resultIdx).call()
      results.push({
        tournamentId: tournament.id,
        resultId: resultIdx,
        isWinner: rawResult['0'],
        playerAddress: rawResult['1'],
        sessionId: rawResult['2'],
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
    const { onActivate, onPlay, onPlayResult, onDeclareWinner, drizzle } = this.props
    const { tournament, ownTournament } = this.state

    const hasTournament = !!tournament

    if (!hasTournament) {
      return (
        <Box width={[1, 1 / 2, 1 / 3]} p={3}>
          <Card p={0} borderColor={"#d6d6d6"}>
            Loading...
          </Card>
        </Box>
      )
    }

    // don't show own tournaments
    if (hasTournament && ownTournament) {
      return (null)
    }

    const canActivate = ownTournament && tournament.state === TOURNAMENT_STATE_DRAFT
    const isActive = tournament.state === TOURNAMENT_STATE_ACTIVE
    const canPlay = !ownTournament && isActive && !tournament.timeIsUp

    const prizeStr = `${drizzle.web3.utils.fromWei(tournament.prize)} ETH`
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

    const tmp = {
      name: "TOSIOS",
      image: "tosios.gif",
      type: "pixijs",
      button: "Join",
      route: "new",
      options: {
        mode: "score attack",
        roomMap: "small",
        roomMaxPlayers: "1",
        roomName: "",
        tournamentId: tournament.id
      }
    }

    return (
      <GameCard game={tmp} />
    )
  }
}

const mapStateToProps = state => {
  return {
    drizzleStatus: state.drizzleStatus,
    address: state.accounts[0],
    networkId: state.web3.networkId
  };
};

export default drizzleConnect(TournamentCard, mapStateToProps)