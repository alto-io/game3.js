import React, { Component } from "react";
import { Card, Heading, Flex, Button, Text, Box} from "rimble-ui";
import RainbowImage from "./RainbowImage";
import styled from "styled-components";

import { format } from 'date-fns'

const StyledFlex = styled(Flex)`
  flex-direction: column;

  @media screen and (min-width: 768px) {
    flex-direction: row;
  }
`
const StyledCard = styled(Card)`
  padding: 1rem 0.5rem;
  margin: 1rem;
  
  @media screen and (min-width: 640px) {
    padding: 2rem 1rem;
    margin: 0 1rem;
  }
`

class PlayerOngoingTournaments extends Component {
  render() {
    const gameName= 'TOSIOS';
    const gameImage = 'tosios.gif';
    const { tournaments, setRoute } = this.props;

    const activeTournaments = tournaments.filter( tournament => tournament.state !== 1);

    const tournamentResults = activeTournaments.map( tournament => {
      return(
        <>
        <StyledFlex mb={"5"} key={tournament.id}>
          <RainbowImage src={"images/" + gameImage}/>
          <Box ml={3}>
            <Heading as={"h4"}>{gameName} - Tournament {tournament.id}</Heading>
            <Text>End Time - { format(new Date(tournament.endTime),'MMM d, yyyy, HH:mm:ss') }</Text>
            <Text>Prize - {tournament.prize} ETH </Text>
            <Text>State - {tournament.state !== 1 ? "Active" : ""}</Text>
            <Text>Your Score: </Text>
          </Box>
        </StyledFlex>
        </>
      )
    });

    return(
      <StyledCard px={3} py={4}>
      <Heading as={"h2"} mb={"3"}>Your Ongoing Tournaments</Heading>
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

export default PlayerOngoingTournaments;