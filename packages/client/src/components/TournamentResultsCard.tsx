import React, { Component } from 'react'

import { Box, Card, Flex, Heading } from "rimble-ui"

import { getGameSession } from '../helpers/database'
import shortenAddress from "../core/utilities/shortenAddress"

import { RouteComponentProps } from '@reach/router';

import CSS from 'csstype';
import {baseColors, fonts, shadows, } from '../styles';

interface IProps extends RouteComponentProps {
  drizzle: any
}

class TournamentResultsCard extends Component<IProps, any> {
  constructor(props) {
    super(props)

    this.state = {
      results: [],
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

  getBlockchainInfo = async (props) => {
    const { tournamentId, drizzle } = props

    this.setState({ isLoading: true })

    console.log(`getBlockchainInfo: ${tournamentId}`)

    const contract = drizzle.contracts.Tournaments;
    const resultsCount = await contract.methods.getResultsCount(tournamentId).call()
    let results = []
    for (let resultIdx = 0; resultIdx < resultsCount; resultIdx++) {
    const rawResult = await contract.methods.getResult(tournamentId, resultIdx).call()
      results.push({
        tournamentId: tournamentId,
        resultId: resultIdx,
        isWinner: rawResult['0'],
        playerAddress: rawResult['1'],
        sessionId: rawResult['2'],
      })
    }

    const promises = results.map(result => getGameSession(result.sessionId, result.playerAddress))
    const sessions = await Promise.all(promises)
    results.forEach((result, idx) => result.sessionData = sessions[idx])
    results = results.filter(result => !!result.sessionData)
    results.sort((el1, el2) => el2.sessionData.timeLeft - el1.sessionData.timeLeft)

    // temp: placeholder results for demo
    results = 
    [
      {
        playerAddress: "0x40848f628B796690502b1F3Da5C31Ea4b4FD838C",
        sessionData: {
          timeLeft: "0:55"
        }
      },
      {
        playerAddress: "0xB83A97B94A7f26047cBDBAdf5eBe53224Eb12fEc",
        sessionData: {
          timeLeft: "0:50"
        }
      },
      {
        playerAddress: "0x9DFb1d585F8C42933fF04C61959b079027Cf88bb",
        sessionData: {
          timeLeft: "0:30"
        }
      }
    ]

    this.setState({
      results,
      isLoading: false
    })
  }


  render () {
    const { results, isLoading } = this.state

    if (isLoading) {
      return (
        <div style={divLoadingStyle}>
          Loading...
        </div>
      )
    }

    const resultDivs = results.map(result => (result.sessionData && (
      <div style={resultDivStyle} key={result.playerAddress}>
        <span style={playerAddressStyle}>
          { shortenAddress(result.playerAddress) }
        </span>
        <span style={timeLeftStyle}>
          { result.sessionData.timeLeft }
        </span>
      </div>
    )) || null )

    return (
      <div style={leaderBoardStyle}>
        <h1>Leaderboard</h1>
        <div style={resultDivsStyle}>
          { resultDivs }
        </div>
      </div>
    )
  }
}

const leaderBoardStyle: CSS.Properties = {
  width: '100%',
  height: '100%',
  padding: '0.8rem 1rem',
  background: baseColors.white,
  boxShadow: shadows.soft
}

const divLoadingStyle: CSS.Properties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
}

const titleHeader: CSS.Properties = {
  textTransform: 'uppercase',
  fontFamily: fonts.family.OpenSans,
  margin: '1rem auto',
  fontSize: fonts.size.h4,
  fontWeight: fonts.weight.medium,
  color: baseColors.dark
}

const resultDivsStyle: CSS.Properties = {
  width: '100%',
  padding: '1rem',
  display: 'flex',
  flexDirection: 'column'
}

const resultDivStyle: CSS.Properties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center'
}

const playerAddressStyle: CSS.Properties = {
  fontSize: fonts.size.medium,
  color: baseColors.dark,
  fontFamily: fonts.family.OpenSans
}

const timeLeftStyle: CSS.Properties = {
  fontSize: fonts.size.medium,
  color: baseColors.lightBlue,
  fontFamily: fonts.family.OpenSans
}

export default TournamentResultsCard