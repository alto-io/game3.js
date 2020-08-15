import React, { Component, Fragment } from 'react';
import { drizzleConnect } from "@drizzle/react-plugin";
import ConnectionBanner from "@rimble/connection-banner";
import { Box, Flex, Text, Link } from "rimble-ui";

import TournamentCard from '../components/TournamentCard';
import { getTournamentContract } from '../helpers/web3';


import { Button, View, Separator, Space } from '../components'
import Tournament from '../components/Tournament'
import styled from 'styled-components'
import { putTournamentData, getFileFromHash } from "../helpers/database"

import { colors } from "../styles"

const SBold = styled.div`
  margin: 1em 0;
  color: rgb(${colors.black});
  t-size: 20px;
  font-weight: 700;
`;


// Optional parameters to pass into RimbleWeb3
const RIMBLE_CONFIG = {
  // accountBalanceMinimum: 0.001,
  requiredNetwork: 5777, // ganache
  // requiredNetwork: 4 // rinkeby
};

class CreateTourneyView extends React.Component<any, any> {

  constructor(props) {
    super(props)

    this.state = {
      currentNetwork: null,
      address: null,
      tournamentsCount: 0
    }
  }

  componentDidMount() {
    const { address, networkId, drizzleStatus, drizzle } = this.props

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
      this.fetchTournaments();
    }
  }

  fetchTournaments = async () => {
    const { drizzle } = this.props

    const contract = drizzle.contracts.Tournaments;
    const tournamentsCount = await contract.methods.getTournamentsCount().call();
    this.setState({
      tournamentsCount,
    })
  }


  onNewTournament = () => {
    this.createTournament()
  }

  createTournament = async () => {
    const { drizzle } = this.props

    const address = this.state.address;
    const contract = drizzle.contracts.Tournaments;

    const timestamp = Date.now() + 10 * 24 * 60 * 60 * 1000
    const data = ''
    const prize = drizzle.web3.utils.toBN(1) // TODO


    this.props.contractMethodSendWrapper(
      "createTournament", // name
      [address, timestamp, data, prize], //contract parameters
      {from: address}, // send parameters
      (txStatus, transaction) => { // callback
      console.log("createTournament callback: ", txStatus, transaction);
      })


    // const receipt = await contract.methods.createTournament(address, timestamp, data, prize)
    //   .send({from: address})

    // const { tournamentId } = receipt.events.TournamentCreated.returnValues

    // // TODO
    // putTournamentData({ id: tournamentId })

    // this.updateTournaments()
  }

  updateTournaments = async () => {
    const { drizzle } = this.props

    const contract = drizzle.contracts.Tournaments;

    const tournamentsCount = await contract.methods.getTournamentsCount().call()
    this.setState({
      tournamentsCount,
    })
  }

  onActivate = (tournament) => {
    this.activateTournament(tournament)
  }

  activateTournament = async (tournament) => {
    const { drizzle } = this.props

    const address = this.state.address;
    const contract = drizzle.contracts.Tournaments;

    await contract.methods.activateTournament(tournament.id, tournament.prize)
      .send({
        from: address,
        value: tournament.prize
      })
    this.updateTournaments()
  }  

  render() {
    const { drizzle } = this.props
    const { tournamentsCount, contract, ownerView } = this.state
    const { web3, address, contractMethodSendWrapper } = this.props

    const noTournaments = tournamentsCount <= 0

    const allTrnsDivs = []
    for(let i = 0; i < tournamentsCount; i++) {
      allTrnsDivs.push(
        <Tournament
          userAddress={address}
          tournamentId={i}
          contract={drizzle.contracts.Tournaments}
          web3={drizzle.web3}
          onPlay={this.onPlay}
          onActivate={this.onActivate}
          onPlayResult={this.showReplay}
          onDeclareWinner={this.declareWinner}
          showOwn={ownerView}
        />
      )
    }

    return (
      <Fragment>
        <View
          flex={true}
          center={true}
          style={{
            padding: 32,
            flexDirection: 'column',
          }}
        >
          <Fragment>
            <video id="recorded"></video>
          </Fragment>
          <Box
            style={{
              width: 500,
              maxWidth: '100%',
            }}
          >
            { !ownerView && (
              <View
                flex={true}
                style={{
                  alignItems: 'flex-start',
                  flexDirection: 'column',
                }}
              >
                <Button
                  title="To organizer view"
                  onClick={() => {this.setState({ownerView: true})}}
                  text={'To organizer view'}
                />
              </View>
            )}
            { ownerView && (
              <View
                flex={true}
                style={{
                  alignItems: 'flex-start',
                  flexDirection: 'column',
                }}
              >
                <Button
                  title="To player view"
                  onClick={() => {this.setState({ownerView: false})}}
                  text={'To player view'}
                />
              </View>
            )}
            { ownerView && (
              <View
                flex={true}
                style={{
                  alignItems: 'flex-start',
                  flexDirection: 'column',
                }}
              >
                <Button
                  title="Sponsor a tournament"
                  onClick={this.onNewTournament}
                  text={'+ New Tournament'}
                />
              </View>
            )}
            <Space size="xxs" />
            <Separator />
            <Space size="xxs" />
            { noTournaments && (
              <View
                flex={true}
                center={true}
                style={{
                  borderRadius: 8,
                  backgroundColor: '#efefef',
                  color: 'darkgrey',
                  height: 128,
                }}
              >
                {'Active tournaments list here'}
              </View>
            )}
            <>
              <View flex={true} style={{ color: 'darkgrey', height: 32 }}>
                {ownerView && (<SBold>My tournaments</SBold>)}
                {!ownerView && (<SBold>Active tournaments</SBold>)}
              </View>
              <Separator />
              <View flex={true} column={true} >
                { allTrnsDivs }
              </View>
            </>
          </Box>
        </View>
      </Fragment>
    )
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

export default drizzleConnect(CreateTourneyView, mapStateToProps);
