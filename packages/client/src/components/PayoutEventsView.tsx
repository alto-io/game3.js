import React, { Component } from 'react';
import { drizzleConnect } from "@drizzle/react-plugin";
import { Box, Card, Heading, Image, Text } from "rimble-ui";
import styled from "styled-components";

import { GAME_DETAILS } from '../constants';

import ViewResultsModal from './ViewResultsModal';

const PlayerTournamentResultsCard = styled(Card)`
  padding: 1rem 0.5rem;
  margin: 1rem;
  
  @media screen and (min-width: 640px) {
    padding: 2rem 1rem;
    margin: 0 1rem;
  }
`
const EventsCard = styled(Card)`
  box-shadow: none;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  flex-direction: column;
  padding: 1rem;

  .tournamentID {
    font-size: 0.75rem;
    letter=spacing: 0.4px;
    margin: 0;
  }

  .gameName {
    font-size: 1rem;
    font-weight: bold;
    letter-spacing: 0.15px;
    margin: 0;
  }

  .h3 {
    font-family: 'Apercu Bold';
    font-size: 1.25rem;
    letter-spacing: 0;
    margin: 0
  }
  
  @media screen and (min-width: 768px) {
    justify-content: space-between;
    align-items: center;
    flex-direction: row;
  }
`

const GameImage = styled(Image)`
  border-radius: 15px;
  margin-bottom: 1rem;
  width: 270px;
  height: 170px;
  
  @media screen and (min-width: 768px) {
    margin-right: 1rem;
    margin-bottom : 0;
    width: 185px;
    height: 123px;
  }
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
      this.fetchTournamentDetails(event.returnValues.tournamentId)
      .then( tournamentDetails => {
        this.addEvent({
          ...event,
          ...tournamentDetails
        })
      })
      // this.addEvent(event)
    })

    // // Mock Data
    // let sampleEvent = {
    //   id: 0,
    //   amount: 2,
    //   tournamentId: 0,
    //   resultId: 1,
    // }

    // this.fetchTournamentDetails(sampleEvent.tournamentId)
    // .then( tournamentDetails => {
    //   this.addEvent({
    //     ...sampleEvent, 
    //     ...tournamentDetails
    //   });
    // })
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
    const { address, tournaments, drizzle } = this.props
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
  
    // If player has winnings
    const eventsRendered = events.map( event => 
      <EventsCard key={event.id}>
        <GameImage src={"images/" + event.gameImage} />
        <Box>
          <p className="tournamentID">Tournament {event.returnValues.tournamentId}</p>
          <h6 className="gameName">{event.gameName} {event.gameStage !== undefined ? "- " + event.gameStage : ""}</h6>
          <h3 className="prize" mb={"3"}>You have won {event.returnValues.amount} ETH</h3>
        </Box>
      </EventsCard>
    );

    // If none 
    const noPayouts = tournaments.filter( tournament => {
      return tournament.results.filter( result => result.isWinner !== true);
    });

    const noPayoutsRendered = noPayouts.map( noPayout => 
      <EventsCard key={noPayout.id}>
        <GameImage src={"images/" + noPayout.gameImage} />
          <Box>
            <p className="tournamentID">Tournament {noPayout.id}</p>
            <h6 className="gameName">{noPayout.gameName} {noPayout.gameStage !== undefined ? "- " + noPayout.gameStage : ""}</h6>
            <h3 className="prize" mb={3}>You'll win next time!</h3>

            <ViewResultsModal 
              tournamentId={noPayout.id}
              playerAddress={address}
              drizzle={drizzle}
              />
          </Box>
      </EventsCard>
      );

    return (
      <PlayerTournamentResultsCard>
        <Heading as={"h2"} mb={3}>Your Tournament Results</Heading>
        {events.length !== 0 ? eventsRendered : ""}
        {noPayoutsRendered.length !== 0 ? noPayoutsRendered : ""}
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