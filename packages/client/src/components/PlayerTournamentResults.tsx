import React, { Component } from "react";
import { Card, Heading, Flex, Box, Button, Text } from "rimble-ui";
import RainbowImage from "./RainbowImage";
import styled from "styled-components";

const StyledFlex = styled(Flex)`
  flex-direction: column;

  @media screen and (min-width: 768px) {
    flex-direction: row;
  }
`

const StyledCard = styled(Card)`
  padding: 1rem 0.5rem;

  @media screen and (min-width: 375px) {
    padding: 1rem;
  }
 
  @media screen and (min-width: 768px) {
    padding: 2rem 1rem;
  }
`

class PlayerTournamentResults extends Component {

  render() {
    const gameName= 'TOSIOS';
    const gameImage = 'tosios.gif';
    const { tournaments, setRoute } = this.props;

    const tournamentResults = tournaments.map( tournament => {
      return (
      <StyledFlex mb={"5"} key={tournament.id}>
        <RainbowImage src={"images/" + gameImage}/>
        <Box ml={3}>
          <Heading as={"h4"}>{gameName} - Tournament {tournament.id}</Heading>
          {tournament.results.find( result => result.isWinner === true) !== undefined ? (
            <>
              <Heading as={"h3"}>You have won {tournament.prize} ETH</Heading>
              <Text> Your Score: { tournament.results[0].sessionData.timeLeft }</Text>
              <Button>Claim Now</Button>
            </>
          ) : (
            <>
              <Heading as={"h3"}>You'll win next time</Heading>
              <Text> Your Score: { tournament.results[0].sessionData.timeLeft } </Text>
            </>
          )}
        </Box>
      </StyledFlex>
      )})

    return(
      <StyledCard>
        <Heading as={"h2"} mb={"3"}>Your Tournament Results</Heading>
        {tournaments.length === 0 ? (
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
        
      </StyledCard>
    )
  }
}

export default PlayerTournamentResults;
