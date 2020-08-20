import React, { Component } from 'react'

import { Box, Card, Flex, Heading } from "rimble-ui"

import { getGameSession } from '../helpers/database'
import shortenAddress from "../core/utilities/shortenAddress"

class TournamentResultsCard extends Component<any, any> {
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
        <Box width={[1, 1 / 2, 1 / 3]} p={3}>
          <Card p={0} borderColor={"#d6d6d6"}>
            Loading...
          </Card>
        </Box>
      )
    }

    const resultDivs = results.map(result => (result.sessionData && (
      <Flex justifyContent={"space-between"} flexDirection={"row"} mb={3}>
        <Box lineHeight={"1em"}>
          { shortenAddress(result.playerAddress) }
        </Box>
        <Box lineHeight={"1em"}>
          { result.sessionData.timeLeft }
        </Box>
      </Flex>
    )) || null )

    return (
      <Box width={[1, 1 / 2, 1 / 3]} p={3}>
        <Card p={0} borderColor={"#d6d6d6"}>
        <Heading as={"h5"} pl={3}>Leaderboard</Heading>
          <Box width={1} p={3}>
            { resultDivs }
          </Box>
        </Card>
      </Box>
    )
  }
}

export default TournamentResultsCard