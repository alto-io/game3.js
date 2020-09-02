import React, { Component } from 'react'

import { Box, Card, Flex, Heading } from "rimble-ui"

import { getGameSession, getTournamentResult } from '../helpers/database'
import { navigateTo } from '../helpers/utilities';
import shortenAddress from "../core/utilities/shortenAddress"

import { RouteComponentProps } from '@reach/router';
import qs from 'querystringify';
import { format } from 'date-fns'

import CSS from 'csstype';
import { baseColors, fonts, shadows, } from '../styles';

import {
  TOURNAMENT_STATE_ACTIVE,
  TOURNAMENT_STATE_ENDED,
  TOURNAMENT_STATE_DRAFT
} from '../constants'

import { Constants } from '@game3js/common';

class TournamentResultsCard extends Component<any, any> {
  constructor(props) {
    super(props)

    this.state = {
      results: [],
      tournament: {},
      isLoading: false
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

  parseData(data) {
    console.log("The data is", data)
    return data.split(' ').join('').split(",");
  }

  async getTournamentAndLeaderBoards(tournamentId: any) {
    const { drizzle } = this.props;

    this.setState({ isLoading: true })

    console.log(`getBlockchainInfo: ${tournamentId}`)
    const contract = drizzle.contracts.Tournaments;
    let results = [];
    let tournament = {
      id: '',
      name: '',
      gameStage: undefined,
      timeZone: '',
      startTime: '',
      endTime: '',
      startDate: '',
      endDate: '',
      state: 0,
      pool: ''
    }

    // Get tournament info

    if (tournamentId === undefined) {
      tournament = null

      return this.setState({
        results,
        tournament,
        isLoading: false
      })
    }

    const raw = await contract.methods.getTournament(tournamentId).call()
    let data = this.parseData(raw['5']);
    const gameName = data[0];
    tournament = {
      id: tournamentId,
      name: gameName,
      gameStage: undefined,
      timeZone: 'GMT+8',
      startTime: '12:00',
      endTime: format(new Date(parseInt(raw['1'])), 'MMM d, yyyy'),
      startDate: '8/16',
      endDate: '9/4',
      state: parseInt(raw['3']),
      pool: raw['4']
    }

    switch (tournament.name) {
      case Constants.WOM:
        tournament.gameStage = "United Kingdom";
        break;
      default:
        tournament.gameStage = undefined;
        break;
    }

    // Get tournament results
    // const resultsCount = await contract.methods.getResultsCount(tournamentId).call()
    let sessionsData = await getTournamentResult(tournamentId);
    if (sessionsData.length > 0) {
      for (let resultIdx = 0; resultIdx < (sessionsData.length > 10 ? 10 : sessionsData.length); resultIdx++) {
        let playerAddress = Object.keys(sessionsData[resultIdx].sessionData.playerData)[0];
        console.log("PLAYER ADD:", playerAddress);
        results.push({
          name: sessionsData[resultIdx].sessionData.playerData[playerAddress].name,
          tournamentId: tournamentId,
          timeIsUp: false,
          playerAddress,
          sessionId: sessionsData[resultIdx].id,
          sessionData: sessionsData[resultIdx].sessionData.playerData[playerAddress]
        })
      }
      // let sessions = [];
      // results.forEach(result => {
      //   session = await 
      // })

      // const sessions = await Promise.all(results.map(async result => {
      //   const session = await getGameSession(result.sessionId, result.playerAddress, tournamentId);
      //   return session;
      // }))  

      // results.forEach((result, idx) => result.sessionData = sessions[idx])
      console.log("RESULTS:", results)
      results = results.filter(result => !!result.sessionData && !!result.name)
      if (results.length > 1) {
        results.sort((el1, el2) => el2.sessionData.currentHighestNumber - el1.sessionData.currentHighestNumber)
      }
    }
    this.setState({
      results,
      tournament,
      isLoading: false
    })
  }

  getBlockchainInfo = async (props) => {
    const { tournamentId, drizzle } = props

    // Get the latest tournament
    const contract = drizzle.contracts.Tournaments;

    const tournamentLength = await contract.methods.getTournamentsCount().call();
    let tI = undefined;
    if (tournamentLength > 0) {
      tI = tournamentId ? tournamentId : tournamentLength - 1;
    }
    console.log("TOURNAMENT ID = ", tI)
    await this.getTournamentAndLeaderBoards(tI);
  }

  getStatus(tournament: any) {
    switch (tournament.state) {
      case TOURNAMENT_STATE_DRAFT:
        return 'Draft'
        break;
      case TOURNAMENT_STATE_ACTIVE:
        return 'Active'
        break;
      case TOURNAMENT_STATE_ENDED:
        return 'Done'
        break;
      default:
        return 'None'
        break;
    }
  }


  formatTourneyTimeInfo(tournament: any) {
    const {
      startDate,
      endTime,
      startTime,
      timeZone
    } = tournament;
    let info =
      `Ends on ${endTime} ${timeZone}`;

    return info;
  }

  // Formats the title of the tournament along with its ID 
  formatTourneyTitle(tournament: any) {
    return `${tournament.name} #${tournament.id}`;
  }

  handleJoinClick = () => {
    const { tournament } = this.state
    let path = '';

    const name = window.prompt("Enter your name", "");
    console.log(`Hi ${name}!`);

    const tosiosOptions = {
      mode: 'score attack',
      roomMap: 'small',
      roomMaxPlayers: '1',
      roomName: '',
      tournamentId: tournament.id,
      playerName: name,
      viewOnly: tournament.timeIsUp
    }

    switch (tournament.name) {
      case Constants.WOM:
        path = '' //Join tourney for wom
        break;
      case Constants.TOSIOS:
        path = `/game/new${qs.stringify(tosiosOptions, true)}`
        break;
      case Constants.FP:
        path = '' //Join tourney for flappy bird
        break;
      default:
        break;
    }
    window.history.replaceState(null, '', path);
    // navigateTo(path);
  }

  render() {
    const { results, isLoading, tournament } = this.state;
    const { tournamentId } = this.props;

    if (isLoading) {
      return (
        <div style={divLoadingStyle}>
          Loading...
        </div>
      )
    }

    let resultDivs = null
    if (results.length > 0) {
      resultDivs = results.map(result => (result.sessionData && (
        <div style={resultDivStyle} key={result.sessionId}>
          <span style={playerAddressStyle}>
            {result.sessionData.name}
          </span>
          <span style={timeLeftStyle}>
            {result.sessionData.currentHighestNumber}
          </span>
        </div>
      )) || null)
    } else {
      if (!tournamentId) {
        resultDivs = (
          <div style={resultDivStyle}>
            Join Tournament to be in leaderboards!
          </div>
        )
      } else {
        resultDivs = null
      }
    }

    return (
      <div style={widgetStyle}>
        {!!tournament ? (
          <>
            <div style={tournamentInfoStyle}>
              {tournament.gameStage ? (
                <span style={tourneyTitleStyle}>{tournament.gameStage}</span>
              ) : (
                  <span style={tourneyTitleStyle}>{this.formatTourneyTitle(tournament)}</span>
                )
              }
              <span style={tourneyTitleInfo}>{this.formatTourneyTimeInfo(tournament)}</span>
              <span style={tourneyTitleInfo}>Status: {this.getStatus(tournament)}</span>
            </div>
            <div style={leaderBoardStyle}>
              <h1 style={titleHeader}>Leaderboard</h1>
              <div style={resultDivsStyle}>
                {resultDivs}
              </div>
            </div>
            {tournamentId === undefined ? (
              <button style={joinTourneyBtn} onClick={this.handleJoinClick}>JOIN TOURNAMENT</button>
            ) : (
                <div style={totalBuyIn} >
                  <span>Total Buy-in Pool</span>
                  <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{tournament.pool} ETH</span>
                </div>
              )}
          </>
        ) : (
            <div style={tournamentInfoStyle}>
              <span style={tourneyTitleStyle}>No Tournaments</span>
            </div>
          )}
      </div>
    )
  }
}

const widgetStyle: CSS.Properties = {
  width: '100%',
  height: '100%',
  padding: '0.8rem 1rem',
  justifyContent: 'center',
}

const leaderBoardStyle: CSS.Properties = {
  width: '100%',
  padding: '0.8rem 1rem',
  display: 'flex',
  flexDirection: 'column',
  margin: '0 0 0.5rem 0',
  background: `rgb(${baseColors.white})`,
  boxShadow: shadows.soft,
  justifyContent: 'center',
  // borderRadius: '7px 7px 0 0'
}

const divLoadingStyle: CSS.Properties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
}

const titleHeader: CSS.Properties = {
  textTransform: 'uppercase',
  fontFamily: fonts.family.ApercuBold,
  margin: '1rem auto',
  fontSize: fonts.size.h4,
  fontWeight: fonts.weight.medium,
  color: `rgb(${baseColors.dark})`
}

const resultDivsStyle: CSS.Properties = {
  width: '100%',
  padding: '1rem',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center'
}

const resultDivStyle: CSS.Properties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  margin: '0 0 1rem 0'
}

const playerAddressStyle: CSS.Properties = {
  fontSize: fonts.size.medium,
  color: `rgb(${baseColors.dark})`,
  fontFamily: fonts.family.ApercuBold
}

const timeLeftStyle: CSS.Properties = {
  fontSize: fonts.size.medium,
  color: `#0093d5`,
  fontFamily: fonts.family.ApercuBold
}

const tournamentInfoStyle: CSS.Properties = {
  width: '100%',
  background: `#ffb600`,
  padding: '0.9rem',
  display: 'flex',
  flexDirection: 'column',
  boxShadow: shadows.soft,
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: '7px 7px 0 0'
}

const tourneyTitleStyle: CSS.Properties = {
  fontSize: fonts.size.h5,
  fontFamily: fonts.family.ApercuBold,
  color: `rgb(${baseColors.dark})`,
  margin: '5px'
}

const tourneyTitleInfo: CSS.Properties = {
  fontSize: fonts.size.medium,
  fontFamily: fonts.family.ApercuLight,
  color: `rgb(${baseColors.dark})`
}

const joinTourneyBtn: CSS.Properties = {
  fontSize: fonts.size.medium,
  fontFamily: fonts.family.ApercuBold,
  color: `rgb(${baseColors.dark})`,
  background: `#06df9b`,
  padding: '1rem 0.9rem',
  width: '100%',
  cursor: 'pointer',
  outline: 'none',
  border: 'none',
  borderRadius: '7px'
}

const totalBuyIn: CSS.Properties = {
  fontSize: fonts.size.medium,
  fontFamily: fonts.family.ApercuBold,
  color: `rgb(${baseColors.dark})`,
  background: `#06df9b`,
  padding: '1rem 0.9rem',
  width: '100%',
  cursor: 'pointer',
  outline: 'none',
  border: 'none',
  borderRadius: '7px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  flexDirection: 'column',
}

export default TournamentResultsCard