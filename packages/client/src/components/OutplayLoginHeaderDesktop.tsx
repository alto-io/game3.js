import React, { Component } from "react";
import {Text, Box, Button, Flex, Image, Link } from "rimble-ui";
import styled from "styled-components";

const StyledLink = styled(Link)`
display: flex;
flex-direction: row;
align-items: center;
&:hover {
  text-decoration: none;
}
`;

const StyledTextLink = styled(Link)`
  &:hover {
    text-decoration: none;
  }
`

const StyledButton = styled(Button)`
  font-family: 'Apercu Light';
  font-size: 0.75rem;
  letter-spacing: 0.4px;
  text-transform: uppercase;
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
      walletIcon
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

          {account && accountValidated ? (
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
                        {shortenAddress(account)}
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
                        {accountBalance.toString()} ETH
                      </Text>
                  </Box>
              </Flex>
            </Flex>
          ) : (
            <StyledButton 
                color="primary" 
                size="small" 
                onClick={handleConnectAccount}>
             Connect your wallet
            </StyledButton>
          )}

        </Flex>


      </Flex>
    )
  }
}

export default OutplayLoginHeaderDesktop;