import React, { Component } from "react";
import { Card, Heading, Image, Text, Box} from "rimble-ui";
import styled from "styled-components";

import { format } from 'date-fns';
import web3 from 'web3';

import NoTournamentsJoinedCard from './NoTournamentsJoinedCard';
import ViewResultsModal from './ViewResultsModal';
import SkeletonResultsLoader from './SkeletonResultsLoader';

const OngoingCard = styled(Card)`
  box-shadow: none;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  flex-direction: column;
  padding: 1rem;

  .tournamentID,
  .lead {
    font-size: 0.75rem;
    letter=spacing: 0.4px;
    margin: 0;
  }

  .gameName {
    font-size: 1.25rem;
    font-weight: bold;
    letter-spacing: 0.15px;
    margin: 0 0 1rem 0;
  }

  @media screen and (min-width: 768px) {
    justify-content: flex-start;
    align-items: center;
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

const GameImage = styled(Image)`
  border-radius: 15px;
  margin-bottom: 1rem;
  width: 270px;
  height: 170px;
  
  @media screen and (min-width: 768px) {
    margin-bottom : 0;
    margin-right: 2rem;
    width: 185px;
    height: 123px;
  }
`

class PlayerOngoingTournaments extends Component {
  render() {
    const { tournaments, setRoute, account, drizzle, isLoading } = this.props;

    if (isLoading) {
      return (
        <SkeletonResultsLoader />
      )
    }

    const activeTournaments = tournaments.filter( tournament => tournament.state === 1);

    const tournamentResults = activeTournaments.map( tournament => {
      const results = tournament.results.map( result => {
        return (
          <Text key={result.resultId}>Result ID: {result.resultId} Your Score: {result.sessionData.currentHighestNumber}</Text>
        )
      });
      
      return(
        <>
        <OngoingCard key={tournament.id} mb={3}>
          <GameImage src={"images/" + tournament.gameImage} m={0}/>
          <Box m={0}>
            <p className="tournamentID">Tournament {tournament.id}</p>
            <h6 className="gameName">{tournament.gameName} {tournament.gameStage !== undefined ? "- " + tournament.gameStage : ""}</h6>
            <p className="lead">End Time</p>
            <Text fontWeight="bold" marginBottom={"0.25rem"}>{ format(new Date(tournament.endTime),'MMM d, yyyy, HH:mm') }</Text>
            <p className="lead">Prize</p>
            <Text fontWeight="bold" marginBottom={"0.25rem"}>{tournament && web3.utils.fromWei(tournament.prize.toString())} ETH</Text>
            <p className="lead">State</p>
            <Text fontWeight="bold" marginBottom={"1rem"}>Active</Text>
            {results}
            <ViewResultsModal
              tournamentId={tournament.id}
              playerAddress={account}
              drizzle={drizzle}
            />
          </Box>
        </OngoingCard>
        </>
      )
    });

    return(
      <StyledCard px={3} py={4}>
        <Heading as={"h2"} mb={"3"}>Your Ongoing Tournaments</Heading>
        {tournaments.length === 0 ? (
          <NoTournamentsJoinedCard setRoute={setRoute}/>
        ) : tournamentResults}
      </StyledCard>
    )
  }
}

export default PlayerOngoingTournaments;