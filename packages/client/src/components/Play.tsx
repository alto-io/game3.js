import React, { useState, useEffect } from "react";
import { drizzleConnect } from "@drizzle/react-plugin";
import ConnectionBanner from "@rimble/connection-banner";
import { Box, Flex, Text } from "rimble-ui";

import { GAME_DETAILS } from '../constants';
import GameCard from '../components/GameCard';

const RIMBLE_CONFIG = {
  // accountBalanceMinimum: 0.001,
  requiredNetwork: parseInt(process.env.REACT_APP_NETWORK_ID),
};

function Play({ drizzle, drizzleStatus, account, accountValidated, networkId, handleSetIsContractOwner, drizzleState }) {
  const [currentNetwork, setCurrentNetwork] = useState(null);
  const [address, setAddress] = useState(null);

  // Set account
  useEffect(() => {
    if (account) {
      setAddress(account);
    }
  }, [account]);

  // Set current network
  useEffect(() => {
    if (networkId) {
      setCurrentNetwork(networkId);
    }
    if (!drizzleStatus.initialized && window.web3 && drizzle !== null) {
      window.web3.version.getNetwork((error, networkId) => {
        setCurrentNetwork(parseInt(networkId));
      });
    }
  }, [networkId, drizzleStatus, drizzle]);

  //  Fetch tournaments and check organizer
  useEffect(()=>{
    if (account && accountValidated) {
      checkOwner();
    }
  }, [account, address, accountValidated])

  const checkOwner = async () => {
    const contract = drizzle.contracts.Tournaments;
    const owner = await contract.methods.owner().call();


    if (owner.toLowerCase() !== account.toLowerCase()) {
      handleSetIsContractOwner(false);
    } else {
      handleSetIsContractOwner(true);
    }
  }

  return (
    <Box>
      {
        !drizzleState ? (
        <Box m={4}>
          <ConnectionBanner
            currentNetwork={currentNetwork}
            requiredNetwork={RIMBLE_CONFIG.requiredNetwork}
            onWeb3Fallback={null}
          />
        </Box>
        ) : (
        <Box maxWidth={"1180px"} p={3} mx={"auto"}>
          <Text my={4} />
          <Flex justifyContent={"space-between"} mx={-3} flexWrap={"wrap"}>
            {GAME_DETAILS.map((game, idx) => {
            return (
                <GameCard
                game={game}
                key={idx}
                />
            );
            })}
          </Flex>
        </Box>  
        )
      }
    </Box>
  );
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

export default drizzleConnect(Play, mapStateToProps);
