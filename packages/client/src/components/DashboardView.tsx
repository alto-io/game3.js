import React, { Component } from 'react';
import { drizzleConnect } from "@drizzle/react-plugin";
import { Flex, Flash, Box } from "rimble-ui";
import styled from "styled-components";

import { isPast } from 'date-fns';

import PayoutEventsView from "./PayoutEventsView";
// import PlayerGameReplays from "./PlayerGameReplays";
import PlayerOngoingTournaments from "./PlayerOngoingTournaments";

const StyledFlex = styled(Flex)`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  margin: 0;
  max-width: 1180px;

  @media screen and (min-width: 375px) {
    margin: 0 auto;
  }

  @media screen and (min-width: 640px) {
    justify-content: center;
    align-items: flex-start;
    flex-direction: row;
  }
`

class DashboardView extends Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      currentNetwork: null,
      address: null,
      tournamentsCount : 0,
      tournaments: []
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
      this.fetchPlayerTournaments();
    }
  }

  fetchPlayerTournaments = async () => {
    const { drizzle } = this.props;

      const contract = drizzle.contracts.Tournaments;
      const tournamentsCount = await contract.methods.getTournamentsCount().call();
  
      let tournaments = [];
  
      for (let tournamentId = 0; tournamentId < tournamentsCount; tournamentId++) {
        const tournamentDetails = await contract.methods.getTournament(tournamentId).call()
        
        const tournament = {
          id: tournamentId,
          organizer: tournamentDetails['0'],
          endTime: parseInt(tournamentDetails['1']),
          prize: tournamentDetails['2'],
          state: parseInt(tournamentDetails['3']),
          balance: tournamentDetails['4'],
          timeIsUp: false,
          canDeclareWinner: false,
          results: [],
          playerAddress: ''
        }
  
        tournament.timeIsUp = isPast(new Date(tournament.endTime));
        tournaments.push(tournament);
      }

      let newTournaments = tournaments.filter( tournament => tournament.playerAddress !== '');
      
      this.setState({
        tournaments: newTournaments
      })

  }

    render() {
      const { account, accountValidated, drizzle, 
        setRoute, store } = this.props;
      const { tournaments } = this.state;

      return (
        <StyledFlex>
          {account && accountValidated ? (
            <>
            <PayoutEventsView 
              account={account}
              accountValidated={accountValidated}
              store={store}
              drizzle={drizzle}
            />

            <PlayerOngoingTournaments 
              drizzle={drizzle} 
              account={account} 
              setRoute={setRoute}
              tournaments={tournaments}
            />
            </>
          ) : (
            <Flash> You have to be logged in to view. </Flash>
          )}
          {/* <PlayerGameReplays /> */}
        </StyledFlex>  
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
  
export default drizzleConnect(DashboardView, mapStateToProps);