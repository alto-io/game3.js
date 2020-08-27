import React, { Component } from "react";
import { Card, Heading, Flex, Box, Button, Text, Flash } from "rimble-ui";
import RainbowImage from "./RainbowImage";

import { getGameSession } from "../helpers/database";

class PlayerTournamentResults extends Component {
  constructor(props){
    super(props);

    this.state = {
      results: [],
      tournamentsCount: 0,
      tournaments:[],
    }
  }

  componentDidMount() {
    this.fetchTournaments();
  }

  fetchTournaments = async () => {
    const { drizzle } = this.props;

    const contract = drizzle.contracts.Tournaments;
    const tournamentsCount = await contract.methods.getTournamentsCount().call();
    this.setState({
      tournamentsCount
    })
    // let tournaments = [];

    for (let tournamentId = 0; tournamentId < tournamentsCount; tournamentId++) {
      const tournamentDetails = await contract.methods.getTournament(tournamentId).call()
      // tournaments.push({
      //   id: tournamentId,
      //   organizer: tournamentDetails[0],
      //   prize: tournamentDetails[2],
      // })

      const resultsCount = await contract.methods.getResultsCount(tournamentId).call()
      let results = []

      for (let resultIdx = 0; resultIdx < resultsCount; resultIdx++) {
        const rawResult = await contract.methods.getResult(tournamentId, resultIdx). call()
        results.push({
          resultId: resultIdx,
          isWinner: rawResult['0'],
          playerAddress: rawResult['1'],
          sessionId: rawResult['2']
        })
      }

      const promises = results.map( result => getGameSession(result.sessionId, result.Address))
      const sessions = await Promise.all(promises)
      results.forEach( (result, idx) => result.sessionData = sessions[idx])
      results = results.filter(result => !!result.sessionData)
      results.sort((el1, el2) => el2.sessionData.timeLeft - el1.sessionData.timeLeft)
      
      const tournament = {
        id : tournamentId,
        organizer : tournamentDetails[0],
        prize: tournamentDetails[2]
      }

      // temp: placeholder results for demo

      results = 
      [
        {
          isWinner: true,
          playerAddress: "0x66aB592434ad055148F20AD9fB18Bf487438943B",
          sessionData: {
            timeLeft: "0:55"
          }
        },
        {
          isWinner: false,
          playerAddress: "0xB83A97B94A7f26047cBDBAdf5eBe53224Eb12fEc",
          sessionData: {
            timeLeft: "0:50"
          }
        },
        {
          isWinner: false,
          playerAddress: "0x9DFb1d585F8C42933fF04C61959b079027Cf88bb",
          sessionData: {
            timeLeft: "0:30"
          }
        },
        {
          isWinner: false,
          playerAddress: "0x66aB592434ad055148F20AD9fB18Bf487438943B",
          sessionData: {
            timeLeft: "0:30"
          }
        }
      ]

      const playerResults = results.filter( result => result.playerAddress.toLowerCase() === this.props.account.toLowerCase());

      this.setState({
        results : playerResults,
        tournaments: tournament
      })
    }
  }

  render() {
    const gameName= 'TOSIOS';
    const gameImage = 'tosios.gif';
    const { results, tournaments } = this.state;

    const tournamentResults = results.map( result => {
      return (
      <Flex mb={"5"}>
        <RainbowImage src={"images/" + gameImage}/>
        <Box ml={3}>
          <Text>{gameName} - Tournament {tournaments.id}</Text>
          {result.isWinner ? (
            <>
              <Heading as={"h3"}>You have won {tournaments.prize} ETH</Heading>
              <Button>Claim Now</Button>
            </>
          ) : (
            <Heading as={"h3"}>You'll win next time</Heading>
          )}
        </Box>
      </Flex>
      )})

    return(
      <Card px={3} py={4}>
        <Heading as={"h2"} mb={"3"}>Your Tournament Results</Heading>
        {results == '' ? (
          <Flex mt={3} justfyContent={"center"} flexDirection={"column"} alignItems={"center"}>
            <Heading as={"h3"}>You haven't joined any tournaments.</Heading>
            <Button 
              alignSelf={"center"} 
              mt={3}
              onClick={e => {
                e.preventDefault();
                this.props.setRoute("TournamentView");
              }}
              >Join a Tournament</Button>
          </Flex>
        ) : tournamentResults}
        
      </Card>
    )
  }
}

export default PlayerTournamentResults;
