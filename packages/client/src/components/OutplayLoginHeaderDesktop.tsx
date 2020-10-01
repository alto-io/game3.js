import React, { Component } from "react";
import {Text, Box, Flex, Image, Link, Button } from "rimble-ui";
import { isMobile } from 'react-device-detect';
import styled from "styled-components";

import ConnectWalletButton from "./ConnectWalletButton";

const StyledLink = styled(Link)`
  display: flex;
  flex-direction: row;
  align-items: center;
  transition: 300ms ease;

  &:hover {
    text-decoration: none;
  }
`;

const StyledTextLink = styled(Link)`
  transition: 300ms ease;
  
  &:hover {
    text-decoration: none;
  }
`

const StyledButtonText = styled(Button.Text)`
  font-size: 0.875rem;
  text-transform: capitalize;
  transition: 300ms ease;

  &:hover {
    color: #7065D8;
    text-decoration: none;
  }
`

class OutplayLoginHeaderDesktop extends Component {
  render() {
    const {
      account, 
      accountBalance,
      accountValidated,
      handleClickLogo, 
      handleConnectAccount,
      shortenAddress, 
      logo, 
      balanceIcon,
      walletIcon,
      rimbleInitialized,
      address,
      balance,
      connected,
      killSession
      } = this.props;

    return(
      <Flex justifyContent={"space-between"} p={3} bg={"white"}>
        <StyledLink 
            fontWeight={600}
            fontSize={"1.13rem"}
            color={"#2B2C36"}
            lineHeight={0.8}
            title={"Back to Home"}
            onClick={handleClickLogo}
        >
          <Image
              paddingRight={2}
              borderColor={"white"}
              overflow={"hidden"}
              src={logo}
          />
          OP<br/>Arcade
        </StyledLink>

        <Flex justifyContent="center" alignItems="center">
          <StyledTextLink 
              href="https://outplay.games" 
              target="_blank"
              title={"To outplay.games"}
              mr={3}
          >
            About Us
          </StyledTextLink>

          {(account && accountValidated && !isMobile) || (balance && connected && isMobile) ? (
            <Flex>
              {/* ID */}
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
                        {!isMobile ? shortenAddress(account) : shortenAddress(address)}
                      </Text>
                  </Box>
              </Flex>

              {/* Balance */}
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
                        {!isMobile ? accountBalance.toString() : balance.toString()} ETH
                      </Text>
                  </Box>
              </Flex>

              {/* Disconnect Button */}
              {isMobile ? (
                <StyledButtonText ml={3} onClick={e => {e.preventDefault(); killSession()}}>Disconnect</StyledButtonText>
              ) : ""}
            </Flex>
          ) : (
            <ConnectWalletButton handleConnectAccount={handleConnectAccount} rimbleInitialized={rimbleInitialized}/>
          )}

        </Flex>


      </Flex>
    )
  }
}

export default OutplayLoginHeaderDesktop;