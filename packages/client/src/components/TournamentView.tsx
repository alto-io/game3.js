import React from "react";
import { drizzleConnect } from "@drizzle/react-plugin";
import ConnectionBanner from "@rimble/connection-banner";
import { Box, Flex, Text } from "rimble-ui";

import TournamentCard from '../components/TournamentCard';

const TEMP_TOURNEY = [{
  name: "Tourney 1",
  image: "RER",
  button: "TEST"
}]

// Optional parameters to pass into RimbleWeb3
const RIMBLE_CONFIG = {
  // accountBalanceMinimum: 0.001,
  requiredNetwork: parseInt(process.env.REACT_APP_NETWORK_ID),
};


class TournamentView extends React.Component<any, any> {

  constructor(props) {
    super(props)

    this.state = {
      currentNetwork: null,
      address: null,
      tournamentsCount: 0,
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

    console.log("tourney count: " + tournamentsCount);
  }

  render() {
    const { drizzleState, address, store, drizzle, account, accountValidated, connectAndValidateAccount, setRoute } = this.props;
    const { currentNetwork, tournamentsCount } = this.state;

    const tournaments = [];
    for(let i = 0; i < tournamentsCount; i++) {
      tournaments.push(
        <TournamentCard
          key={i}
          tournamentId={i}
          address={address}
          store={store}
          drizzle={drizzle}
          account={account}
          accountValidated={accountValidated}
          connectAndValidateAccount={connectAndValidateAccount}
          setRoute={setRoute}
        />
      );
    }

    return (
      <>
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
                { tournaments }
              </Flex>
            </Box>  
        </Box>
      </>
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
