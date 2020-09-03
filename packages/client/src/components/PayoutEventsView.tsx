import React, { Component } from 'react';
import { drizzleConnect } from "@drizzle/react-plugin";
import { Box, Card, Heading, Image, Text } from "rimble-ui";
import styled from "styled-components";

import { GAME_DETAILS } from '../constants';

const PlayerTournamentResultsCard = styled(Card)`
  padding: 1rem 0.5rem;
  margin: 1rem;
  
  @media screen and (min-width: 640px) {
    padding: 2rem 1rem;
    margin: 0 1rem;
  }
`
const EventsCard = styled(Card)`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  flex-direction: column;
  box-shadow: none;

  @media screen and (min-width: 720px) {
    flex-direction: row;
  }
`

const GameImage = styled(Image)`
  width: 270px;
  height: 170px;
`

class PayoutEventsView extends Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      currentNetwork: null,
      address: null,
      events:[],
      tournamentEvents: []
    }
  }

  componentDidMount() {
    const { address, networkId, drizzleStatus, drizzle} =  this.props

    this.updateAddress(address)
    this.updateDrizzle(networkId, drizzleStatus, drizzle)
  }

  componentWillReceiveProps(newProps) {
    const { address, networkId, drizzleStatus, drizzle } = this.props
    const { address: newAddress, networkId: newNetworkId, 
      drizzleStatus: newDrizzleStatus, drizzle: newDrizzle } = newProps

    if (address !== newAddress) {
      this.updateAddress(newAddress)
    }
    if (networkId !== newNetworkId || drizzleStatus !== newDrizzleStatus
      || drizzle !== newDrizzle) {
      this.updateDrizzle(newNetworkId, newDrizzleStatus, newDrizzle)
    }
  }

  updateAddress = (address) => {
    this.setState({ address })
  }

  updateDrizzle = (networkId, drizzleStatus, drizzle) => {
    if (networkId) {
      this.setState({ currentNetwork: networkId} );
    }
    if (!drizzleStatus.initialized && window.web3 && drizzle !== null) {
      window.web3.version.getNetwork((error, networkId) => {
        this.setState({ currentNetwork: parseInt(networkId) } );
      });
    }
    if (drizzleStatus.initialized && window.web3 && drizzle !== null) {
      this.fetchEvents();
    }
  }

  fetchEvents = async () => {
    const { drizzle, account } = this.props;

    const contract = drizzle.contracts.Tournaments;
    contract.events.PrizeTransfered({
      filter: { player: account },
      fromBlock: 0
    })
    .on('data', (event) => {
      this.fetchTournamentDetails(event.tournamentId)
      .then( tournamentDetails => {
        this.addEvent({
          ...event,
          ...tournamentDetails
        })
      })
      // this.addEvent(event)
    })

    // Mock Data
    let sampleEvent = {
      id: 0,
      amount: 2,
      tournamentId: 0,
      resultId: 1,
    }

    this.fetchTournamentDetails(sampleEvent.tournamentId)
    .then( tournamentDetails => {
      this.addEvent({
        ...sampleEvent, 
        ...tournamentDetails
      });
    })
  }

  addEvent = (event) => {
    const { events } = this.state
    events.push(event)
    this.setState({
      events
    })
  }

  fetchTournamentDetails = async (tournamentId) => {
    const { drizzle, parseData } = this.props;

    const contract = drizzle.contracts.Tournaments;
    const tournamentDetails = await contract.methods.getTournament(tournamentId).call();
    const data = parseData(tournamentDetails['5']);
    const gameDetails = GAME_DETAILS.find( game => game.name.toLowerCase() === data[0].toLowerCase());
  
    const tournament = {
      gameName: gameDetails.name,
      gameStage: data[1],
      gameImage: gameDetails.image
    }

    return tournament;
  }
  
  render() {
    const { account, accountValidated, tournaments} = this.props
    const { events } = this.state

    // const eventsRendered = events.map(event => 
    //   <Flex key={event.id}>
    //     <Box mr={2}>Amount: {event.returnValues.amount}</Box>
    //     <Box mr={2}>tournamentId: {event.returnValues.tournamentId}</Box>
    //     <Box mr={2}>resultId: {event.returnValues.resultId}</Box>
    //   </Flex>
    // )

    // event.returnValues.amount
    // tournamentId
    // resultId
  
    const eventsRendered = events.map( event => 
      <EventsCard key={event.id}>
        <GameImage src={"images/" + event.gameImage} />
        <Box ml={3}>
          <Text m={0}>Tournament {event.tournamentId}</Text>
          <Heading as={"h5"} mb={2}>{event.gameName} {event.gameStage !== undefined ? "- " + event.gameStage : ""}</Heading>
          <Heading as={"h3"} mb={3}>You have won {event.amount}</Heading>
        </Box>
      </EventsCard>
    );

    return (
      <PlayerTournamentResultsCard>
        <Heading as={"h2"} mb={3}>Your Tournament Results</Heading>
        {events.length !== 0 ? eventsRendered : ""}
      </PlayerTournamentResultsCard>  
    );
  }

}
/*
 * Export connected component.
 */
const mapStateToProps = state => {
  return {
    drizzleStatus: state.drizzleStatus,
    address: state.accounts[0],
    networkId: state.web3.networkId
  };
};
  
export default drizzleConnect(PayoutEventsView, mapStateToProps);