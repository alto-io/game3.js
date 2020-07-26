import React, { useState, useEffect } from "react";
import { Text, Box, Button, Flex, Image } from "rimble-ui";
import styled from "styled-components";
import { drizzleConnect } from "@drizzle/react-plugin";
import logo from "../images/rimble-logo.svg";
import walletIcon from "./../images/icon-wallet.svg";
import balanceIcon from "./../images/icon-balance.svg";
import shortenAddress from "../core/utilities/shortenAddress";

const StyledHeader = styled(Flex)`
  border-bottom: 1px solid #d6d6d6;
  box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.01);
`;

const connectWallet = () => {
  // initiate wallet connection
  return;
};

function HeaderNav({ drizzle, preflightCheck, address, accountBalances }) {
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState(null);

  useEffect(() => {
    if (address) {
      setAccount(address);
    }
  }, [address]);

  useEffect(() => {
    if (Object.keys(accountBalances).length > 0 && address !== null) {
      setBalance(accountBalances[address].toString());
    }
  }, [accountBalances, address]);

  return (
    <StyledHeader justifyContent={"space-between"} p={3} bg={"white"}>
      {/* <Image src={logo} /> */}
      <Text
                fontWeight={600}
                fontSize={"12px"}
                color={"#2B2C36"}
                lineHeight={1}
              >
               Game3.js
              </Text>
      
      {account && balance ? (
        <Flex>
          <Flex alignItems={"center"} mr={4}>
            <Image src={walletIcon} mr={2} />
            <Box>
              <Text
                fontWeight={600}
                fontSize={"12px"}
                color={"#2B2C36"}
                lineHeight={1}
              >
                Connected as
              </Text>
              <Text fontSize={1} color={"primary"}>
                {shortenAddress(account)}
              </Text>
            </Box>
          </Flex>

          <Flex alignItems={"center"}>
            <Image src={balanceIcon} mr={2} />
            <Box>
              <Text
                fontWeight={600}
                fontSize={"12px"}
                color={"#2B2C36"}
                lineHeight={1}
              >
                Balance
              </Text>
              <Text fontSize={1} color={"primary"}>
                {drizzle.web3.utils.fromWei(balance, "ether")} ETH
              </Text>
            </Box>
          </Flex>
        </Flex>
      ) : (
        <Button
          size={"small"}
          onClick={() => {
            preflightCheck(() => {
              connectWallet();
            });
          }}
        >
          Connect
        </Button>
      )}
    </StyledHeader>
  );
}

/*
 * Export connected component.
 */
const mapStateToProps = state => {
  console.log("state", state);
  return {
    drizzleStatus: state.drizzleStatus,
    address: state.accounts[0],
    accountBalances: state.accountBalances
  };
};

export default drizzleConnect(HeaderNav, mapStateToProps);
