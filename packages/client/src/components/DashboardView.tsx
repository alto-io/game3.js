import React, { Component } from 'react';
import { drizzleConnect } from "@drizzle/react-plugin";
import { Flex, Flash } from "rimble-ui";
import styled from "styled-components";

import { isPast } from 'date-fns';

import { getGameSession } from "../helpers/database";
import { Constants } from '@game3js/common';
import PayoutEventsView from "./PayoutEventsView";
import PlayerOngoingTournaments from "./PlayerOngoingTournaments";
// import PlayerGameReplays from "./PlayerGameReplays";

const StyledFlex = styled(Flex)`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  margin: 0 auto;
  width: 100%;

  @media screen and (min-width: 1024px) {
    justify-content: space-evenly;
    align-items: flex-start;
    flex-direction: row;
    flex-wrap: wrap;
    width: 90%;
  }

  @media screen and (min-width: 1200px) {
    max-width: 1138px;
  }
`

interface IProps {
  account: any;
  accountValidated: any;
  address: any;
  networkId: any;
  drizzle: any;
  drizzleStatus: any;
  setRoute: any;
  store: any;
}

interface IState {
  isLoading: boolean;
  tournaments: Array<object>;
  tournamentsCount: number;
  currentNetwork: any;
  address: any;
}

class DashboardView extends Component<IProps, IState> {
  constructor(props) {
    super(props);
    this.state = {
      currentNetwork: null,
      address: null,
      tournamentsCount : 0,
      tournaments: [],
      isLoading: false
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

  parseData = (data) => {
    console.log("The data is", data)
    return data.split(' ').join('').split(",");
  }

  fetchPlayerTournaments = async () => {
    const { drizzle, address } = this.props;

      this.setState({ isLoading: true })

      const contract = drizzle.contracts.Tournaments;
      const tournamentsCount = await contract.methods.getTournamentsCount().call();
  
      let tournaments = [];

      if (!tournamentsCount) {
        this.setState({
          tournaments: [],
          isLoading: false
        })
      }

      for (let tournamentId = 0; tournamentId < tournamentsCount; tournamentId++) {
        const tournamentDetails = await contract.methods.getTournament(tournamentId).call()
        const data = this.parseData(tournamentDetails['5']);
        
        const tournament = {
          id: tournamentId,
          organizer: tournamentDetails['0'],
          endTime: parseInt(tournamentDetails['1']),
          prize: tournamentDetails['2'],
          state: parseInt(tournamentDetails['3']),
          balance: tournamentDetails['4'],
          gameName: '',
          gameStage: data[1],
          gameImage: '',
          timeIsUp: false,
          canDeclareWinner: false,
          results: []
        }
  
        switch (data[0]) {
          case 'wom' :
            tournament.gameName = 'World of Mines';
            tournament.gameImage = Constants.WOM_IMG;
            break;
          case 'tosios' :
            tournament.gameName = 'TOSIOS';
            tournament.gameImage = Constants.TOSIOS_IMG;
            break;
          case 'fp' :
            tournament.gameName = 'Flappy Bird Open-Source';
            tournament.gameImage = Constants.FP_IMG;
            break;
        }
        
        tournament.timeIsUp = isPast(new Date(tournament.endTime));
  
        let results = []
        const resultsCount = await contract.methods.getResultsCount(tournament.id).call()
        for (let resultIdx = 0; resultIdx < resultsCount; resultIdx++) {
          const resultDetails = await contract.methods.getResult(tournament.id, resultIdx).call()
          const result = ({
            tournamentId: tournament.id,
            resultId: resultIdx,
            isWinner: resultDetails['0'],
            playerAddress: resultDetails['1'].toLowerCase(),
            sessionId: resultDetails['2'],
            sessionData: {}
          })
          
          this.fetchGameSession(result.sessionId, address, tournamentId)
          .then( gameSession => {
            result.sessionData = gameSession;
          });
          
          results.push(result);
        }

        let playerResults = results.filter( result => result.playerAddress === address.toLowerCase());
        tournament.results = playerResults;

        const buyIn = await contract.methods.buyIn(tournamentId, address).call();

        if (parseInt(buyIn) !== 0) {
          tournaments.push(tournament);
        }
      }

      this.setState({
        tournaments,
        isLoading: false
      })
  }

  fetchGameSession = async (sessionId, playerAddress, tournamentId) => {
    const gameSession = await getGameSession(sessionId, playerAddress, tournamentId);
    return gameSession;
  }

    render() {
      const { account, accountValidated, drizzle, 
        setRoute, store } = this.props;
      const { tournaments, isLoading } = this.state;

      return (
        <StyledFlex>
          {account && accountValidated ? (
            <>
            <PayoutEventsView 
              account={account}
              accountValidated={accountValidated}
              store={store}
              drizzle={drizzle}
              tournaments={tournaments}
              parseData={this.parseData}
              isLoading={isLoading}
            />

            <PlayerOngoingTournaments 
              drizzle={drizzle} 
              account={account} 
              setRoute={setRoute}
              tournaments={tournaments}
              isLoading={isLoading}
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