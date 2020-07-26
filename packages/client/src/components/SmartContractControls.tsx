import React, { useState, useEffect } from "react";
import { drizzleConnect } from "@drizzle/react-plugin";

import { ThemeProvider, Box, Flex, Card, Text, Heading } from "rimble-ui";

import NetworkIndicator from "@rimble/network-indicator";

import CounterCardContainer from './CounterCard.container';

function SmartContractControls({ drizzle, drizzleState, drizzleStatus, account, networkId, contracts }) {
    const [currentNetwork, setCurrentNetwork] = useState(null);
    const [address, setAddress] = useState(null);

    const token = {
        id: "Counter",
        name: "Conference ticket",
        ethPrice: "5.63",
        image: "conference.png",
        description: "Entrance to DevCon VI",
        successTitle: "You're going to DevCon!",
        successInstructions:
            "Just show this ticket token in your wallet when you arrive at the conference venue."
    }

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

    return (
        <Card maxWidth={'640px'} mx={'auto'} p={3} px={4}>
            <NetworkIndicator
            currentNetwork={currentNetwork}
            requiredNetwork={currentNetwork /*in prod: drizzleConfig.requiredNetwork*/ }
            />
            {/*
            <CounterCardContainer
                token={token}
                address={address}
                key={token.id}
            />
            */}
        </Card>
    )
}

/*
 * Export connected component.
 */
const mapStateToProps = state => {
    console.log(state);
  return {
    drizzleStatus: state.drizzleStatus,
    address: state.accounts[0],
    networkId: state.web3.networkId,
  };
};

export default drizzleConnect(
    SmartContractControls, 
    mapStateToProps   
);
