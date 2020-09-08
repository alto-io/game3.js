import React, { Component } from "react";
import { Card, Heading, Flex, Box, Button, Text } from "rimble-ui";
import RainbowImage from "./RainbowImage";
import styled from "styled-components";

import web3 from 'web3';

import NoTournamentsJoinedCard from './NoTournamentsJoinedCard';

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

const StyledButton = styled(Button)`
  font-family: 'Apercu Light';
  font-size: 0.75rem;
  letter-spacing: 0.4px;
  text-transform: uppercase;
`

class PlayerTournamentResults extends Component {

  render() {
    const gameName= 'TOSIOS';
    const gameImage = 'tosios.gif';
    const { tournaments, setRoute } = this.props;

    const winningResult = (tournament) => {
      const result = tournament.results.find( result => result.isWinner === true);
      return(
        <>
          <Heading as={"h3"}>You have won {tournament && web3.utils.fromWei(tournament.prize.toString())} ETH</Heading>
          <Text> Your Score: {result.sessionData.currentHighestNumber}</Text>
          <StyledButton mt={3}>Claim Now</StyledButton>
        </>
      )
    }

    const tournamentResultsCard = tournaments.map( tournament => {
      const results = tournament.results.map( result => {
        return(
          <Text key={result.resultId}>Result: {result.resultId} Your Score: {result.sessionData.currentHighestNumber}</Text>
        )
      })

      return (
      <StyledFlex mb={"5"} key={tournament.id} alignItems={"center"}>
        <RainbowImage src={"images/" + gameImage}/>
        <Box ml={3}>
          <Heading as={"h4"} m={0}>{gameName} - Tournament {tournament.id}</Heading>
          {tournament.results.find( result => result.isWinner === true) !== undefined ? (
            winningResult(tournament)
          ) : 
            <>
              <Heading as={"h3"}>You'll win next time</Heading>
              <StyledButton>View Results</StyledButton>
            </> 
          }
        </Box>
      </StyledFlex>
      )})

    return(
      <StyledCard>
        <Heading as={"h2"} mb={"3"}>Your Tournament Results</Heading>
        {tournaments.length === 0 ? (
          <NoTournamentsJoinedCard setRoute={setRoute}/>
        ) : tournamentResultsCard}
        
      </StyledCard>
    )
  }
}

export default PlayerTournamentResults;
