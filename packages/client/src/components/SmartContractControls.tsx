import React, { useState, useEffect } from "react";
import { drizzleConnect } from "@drizzle/react-plugin";
import { ThemeProvider, Box, Flex, Card, Text, Heading } from "rimble-ui";
import NetworkIndicator from "@rimble/network-indicator";
import drizzleConfig from "../drizzleConfig";

function SmartContractControls({ drizzle, drizzleState, drizzleStatus, account, networkId }) {
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


    return (
        <Card maxWidth={'640px'} mx={'auto'} p={3} px={4}>
            <NetworkIndicator
            currentNetwork={currentNetwork}
            requiredNetwork={currentNetwork /*in prod: drizzleConfig.requiredNetwork*/ }
            />
        </Card>
    )
  
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

export default drizzleConnect(SmartContractControls, mapStateToProps);
