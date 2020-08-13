import React, { useState, useEffect } from "react";
import { drizzleConnect } from "@drizzle/react-plugin";
import ConnectionBanner from "@rimble/connection-banner";
import { Box, Flex, Text, Link } from "rimble-ui";

import GameCard from '../components/GameCard';

const TEMP_TOURNEY = [{
  name: "Tourney 1",
  image: "RER",
  button: "TEST"
}]

// Optional parameters to pass into RimbleWeb3
const RIMBLE_CONFIG = {
  // accountBalanceMinimum: 0.001,
  // requiredNetwork: 5777, // ganache
  requiredNetwork: 4 // rinkeby
};

class TournamentView extends React.Component<any, any> {

  constructor(props) {
    super(props)

    this.state = {
      currentNetwork: null,
      address: null
    }
  }

  componentDidMount() {
    const { account, networkId, drizzleStatus, drizzle } = this.props

    this.updateAddress(account)
    this.updateDrizzle(networkId, drizzleStatus, drizzle)
  }

  componentWillReceiveProps(newProps) {
    const { account, networkId, drizzleStatus, drizzle } = this.props
    const { account: newAccount, networkId: newNetworkId, 
      drizzleStatus: newDrizzleStatus, drizzle: newDrizzle } = newProps

    if (account !== newAccount) {
      this.updateAddress(account)
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
  }

  render() {
    const { drizzleState } = this.props
    const { currentNetwork } = this.state
    return (
      <Box>
        {
          !drizzleState && (
          <Box m={4}>
            <ConnectionBanner
              currentNetwork={currentNetwork}
              requiredNetwork={RIMBLE_CONFIG.requiredNetwork}
              onWeb3Fallback={null}
            />
          </Box>
          )
        }
          <Box maxWidth={"1180px"} p={3} mx={"auto"}>
              <Text my={4} />
              <Flex justifyContent={"space-between"} mx={-3} flexWrap={"wrap"}>
                  {TEMP_TOURNEY.map(game => {
                  return (
                      <GameCard
                      game={game}
                      />
                  );
                  })}
              </Flex>
          </Box>  
      </Box>
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

export default drizzleConnect(TournamentView, mapStateToProps);
