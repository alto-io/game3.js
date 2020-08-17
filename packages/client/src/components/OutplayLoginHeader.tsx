import React from "react";
import { Card, Text, Box, Button, Flex, Image, Link } from "rimble-ui";

import RimbleWeb3 from "../rimble/RimbleWeb3";

import styled from "styled-components";

import TransactionToastUtil from "../rimble/TransactionToastUtil";
import SmartContractControls from "./SmartContractControls";
import TransactionsCard from "./TransactionsCard";

import AccountOverview from "../rimble/components/AccountOverview";

import walletIcon from "./../images/icon-wallet.svg";
import balanceIcon from "./../images/icon-balance.svg";
import shortenAddress from "../core/utilities/shortenAddress";
import { navigate } from '@reach/router';

const StyledHeader = styled(Flex)`
border-bottom: 1px solid #d6d6d6;
box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.01);
`;


class OutplayLoginHeader extends React.Component {

    private contractInitialized:boolean = false;

    handleClickLogo = () => {
      navigate('/');
    }

    handleConnectAccount = () => {
        this.props.connectAndValidateAccount(result => {
          if (result === "success") {
            // success
            console.log("Callback SUCCESS");
          } else if (result === "error") {
            // error
            console.log("Callback ERROR");
          }
        })
      }    

    componentDidUpdate() {

        if (!this.contractInitialized)
        {
            if (this.props.drizzle.contracts.Tournaments)

            {
                console.log(this.props.drizzle.contracts.Tournaments)

                // get initial contract
                const tournamentContract = this.props.drizzle.contracts.Tournaments;
                const contractAddress = tournamentContract.address;
                const contractAbi = tournamentContract.abi;

                // // Init the contract after the web3 provider has been determined
                this.props.initContract(contractAddress, contractAbi).then(() => {
                // Can finally interact with contract
                //   this.getNumber();
                });

                console.log("contract initialized");
                this.contractInitialized = true;
            }
        }
      }    

    render() {
    const {
        contract,
        account,
        accountBalance,
        transactions,
        initContract,
        initAccount,
        drizzle
        } = this.props;        
    return (
        <>
            <StyledHeader justifyContent={"space-between"} p={3} bg={"white"}>
            {/* <Image src={logo} /> */}
            <Link
                      fontWeight={600}
                      fontSize={"32px"}
                      color={"#2B2C36"}
                      lineHeight={1}
                      title={
                        "Back to Home"
                      }
                      onClick={this.handleClickLogo}
                    >
                     OP Arcade
            </Link>

            {this.props.account && this.props.accountValidated ? (
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
                      {accountBalance.toString()} ETH
                    </Text>
                  </Box>
                </Flex>
              </Flex>
            ) : (
                <>
                <Button size="small" onClick={this.handleConnectAccount}>
                  Connect your wallet
                </Button>
                </>
            )}
          </StyledHeader>
           <TransactionToastUtil transactions={transactions} />
        </>
    );
  }
}

export default OutplayLoginHeader;

/*

          <div>
            <Card maxWidth={'640px'} px={4} mx={'auto'}>
              <SmartContractControls
                contract={contract}
                account={account}
                transactions={transactions}
                initContract={initContract}
                contractMethodSendWrapper={contractMethodSendWrapper}
              />
            </Card>

            <TransactionsCard transactions={transactions} />
          </div>

          */