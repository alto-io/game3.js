import React, { Component } from 'react';
import { drizzleConnect } from "@drizzle/react-plugin";
import { Flex, Flash } from "rimble-ui";

import { format, isPast } from 'date-fns';
import { TOURNAMENT_STATE_DRAFT, TOURNAMENT_STATE_ACTIVE, TOURNAMENT_STATE_ENDED } from '../constants';

import PlayerTournamentResults from "./PlayerTournamentResults";
// import PlayerGameReplays from "./PlayerGameReplays";
import PlayerOngoingTournaments from "./PlayerOngoingTournaments";

class DashboardView extends Component {
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
    const { drizzle, account, accountValidated } = this.props;

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
          results: []
        }
  
        tournament.timeIsUp = isPast(new Date(tournament.endTime));
  
        const resultsCount = await contract.methods.getResultsCount(tournament.id).call()
        let results = []
        for (let resultIdx = 0; resultIdx < resultsCount; resultIdx++) {
          const resultDetails = await contract.methods.getResult(tournament.id, resultIdx).call()
          results.push({
            tournamentId: tournament.id,
            resultId: resultIdx,
            isWinner: resultDetails['0'],
            playerAdress: resultDetails['1'],
            sessionData: resultDetails['2']
          })
        }
  
        results = 
        [
          {
            tournamentId: tournament.id,
            isWinner: true,
            playerAddress: "0x66aB592434ad055148F20AD9fB18Bf487438943B",
            sessionData: {
              timeLeft: "0:55"
            }
          },
          {
            tournamentId: tournament.id,
            isWinner: false,
            playerAddress: "0xB83A97B94A7f26047cBDBAdf5eBe53224Eb12fEc",
            sessionData: {
              timeLeft: "0:50"
            }
          },
          {
            tournamentId: tournament.id,
            isWinner: false,
            playerAddress: "0x9DFb1d585F8C42933fF04C61959b079027Cf88bb",
            sessionData: {
              timeLeft: "0:30"
            }
          },
          {
            tournamentId: tournament.id,
            isWinner: false,
            playerAddress: "0x66aB592434ad055148F20AD9fB18Bf487438943B",
            sessionData: {
              timeLeft: "0:30"
            }
          }
        ]
        
        // if (account && accountValidated) {
          tournament.results = results.filter( result => result.playerAddress.toLowerCase() === this.props.account.toLowerCase());

          const winner = results.find( result => result.isWinner === true);
          
          if (winner !== undefined) {
            tournament.canDeclareWinner = true;
          } else {
            tournament.canDeclareWinner = false;
          }  
        // }

        tournaments.push(tournament);
  
        this.setState({
          tournaments
        })

        console.log(tournaments);
      }
 
  }

    render() {

      return (
        <Flex maxWidth={"1180px"} p={3} mx={"auto"}>
          {this.props.account && this.props.accountValidated ? (
            <>
            {/* <PlayerTournamentResults 
            drizzle={this.props.drizzle} 
            account={this.props.account} 
            setRoute={this.props.setRoute}/>

            <PlayerOngoingTournaments /> */}
            {/* <PlayerGameReplays /> */}
            </>
          ) : (
            <Flash> You have to be logged in to view. </Flash>
          )}
        </Flex>  
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