import React, { Component } from "react";
import { Card, Heading, Flex, Box, Button, Text } from "rimble-ui";
import RainbowImage from "./RainbowImage";

import { getGameSession } from "../helpers/database";

class PlayerTournamentResults extends Component {

  render() {
    const gameName= 'TOSIOS';
    const gameImage = 'tosios.gif';
    const { tournaments, resultsCount, setRoute } = this.props;

    const tournamentResults = tournaments.map( tournament => {
      return (
      <Flex mb={"5"}>
        <RainbowImage src={"images/" + gameImage}/>
        <Box ml={3}>
          <Text>{gameName} - Tournament {tournament.id}</Text>
          {tournament.results.find( result => result.isWinner === true) !== undefined ? (
            <>
              <Heading as={"h3"}>You have won {tournament.prize} ETH</Heading>
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
        {resultsCount == '' ? (
          <Flex mt={3} justfyContent={"center"} flexDirection={"column"} alignItems={"center"}>
            <Heading as={"h3"}>You haven't joined any tournaments.</Heading>
            <Button 
              alignSelf={"center"} 
              mt={3}
              onClick={e => {
                e.preventDefault();
                setRoute("TournamentView");
              }}
              >Join a Tournament</Button>
          </Flex>
        ) : tournamentResults}
        
      </Card>
    )
  }
}

export default PlayerTournamentResults;
