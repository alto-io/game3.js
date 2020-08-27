import React, { Component } from "react";
import { Card, Heading, Flex, Button, Text, Box} from "rimble-ui";
import RainbowImage from "./RainbowImage";
import styled from "styled-components";

import { format } from 'date-fns'

const StyledCard = styled(Card)`
  margin: 1rem 0;
  width: 100%;
`

class PlayerOngoingTournaments extends Component {
  render() {
    const gameName= 'TOSIOS';
    const gameImage = 'tosios.gif';
    const { tournaments, resultsCount, setRoute } = this.props;

    const activeTournaments = tournaments.filter( tournament => tournament.state !== 1);

    const tournamentResults = activeTournaments.map( tournament => {
      return(
        <>
        <Flex mb={"5"}>
          <RainbowImage src={"images/" + gameImage}/>
          <Box ml={3}>
            <Heading as={"h4"}>{gameName} - Tournament {tournament.id}</Heading>
            <Text>End Time - { format(new Date(tournament.endTime),'MMM d, yyyy, HH:mm:ss') }</Text>
            <Text>Prize - {tournament.prize} ETH </Text>
            <Text>State - {tournament.state !== 1 ? "Active" : ""}</Text>
          </Box>
        </Flex>
        </>
      )
    });

    return(
      <StyledCard px={3} py={4}>
      <Heading as={"h2"} mb={"3"}>Your Ongoing Tournaments</Heading>
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
        
    </StyledCard>
    )
  }
}

export default PlayerOngoingTournaments;