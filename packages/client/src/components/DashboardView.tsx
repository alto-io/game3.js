import React, { Component } from 'react';
import { drizzleConnect } from "@drizzle/react-plugin";
import { Flex, Flash, Box } from "rimble-ui";
import styled from "styled-components";

import { isPast } from 'date-fns';

import PlayerTournamentResults from "./PlayerTournamentResults";
// import PlayerGameReplays from "./PlayerGameReplays";
import PlayerOngoingTournaments from "./PlayerOngoingTournaments";

const StyledFlex = styled(Flex)`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  @media screen and (min-width: 768px) {
    justify-content: center;
    align-items: flex-start;
    flex-direction: row;
  }
`

class DashboardView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentNetwork: null,
      address: null,
      tournamentsCount : 0,
      tournaments: [],
      resultsCount: 0
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
            isWinner: false,
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
        ]
        
          tournament.results = results.filter( result => result.playerAddress.toLowerCase() === account.toLowerCase());

          const winner = results.find( result => result.isWinner === true);
          
          if (winner !== undefined) {
            tournament.canDeclareWinner = true;
          } else {
            tournament.canDeclareWinner = false;
          }  

        tournaments.push(tournament);
  
        this.setState({
          tournaments,
          resultsCount
        })

        console.log(tournaments);
      }
 
  }

    render() {
      const { account, accountValidated, drizzle, setRoute } = this.props;
      const { tournaments, resultsCount } = this.state;

      return (
        <StyledFlex maxWidth={"1180px"} p={3} mx={"auto"}>
          {account && accountValidated ? (
            <>
            <PlayerTournamentResults 
              drizzle={drizzle} 
              account={account} 
              setRoute={setRoute}
              tournaments={tournaments}
              resultsCount={resultsCount}
              className="tournament-card"
            />

            <PlayerOngoingTournaments 
              drizzle={drizzle} 
              account={account} 
              setRoute={setRoute}
              tournaments={tournaments}
              resultsCount={resultsCount}
              className="tournament-card"
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