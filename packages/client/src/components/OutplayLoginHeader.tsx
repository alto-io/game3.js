import React, { useState, useEffect } from "react";
import { Card, Text, Box, Button, Flex, Image } from "rimble-ui";
import { drizzleConnect } from "@drizzle/react-plugin";
import RimbleWeb3 from "../rimble/RimbleWeb3";

import styled from "styled-components";

import TransactionToastUtil from "../rimble/TransactionToastUtil";
import SmartContractControls from "./SmartContractControls";
import TransactionsCard from "./TransactionsCard";

import AccountOverview from "../rimble/components/AccountOverview";

const StyledHeader = styled(Flex)`
border-bottom: 1px solid #d6d6d6;
box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.01);
`;

const handleConnectAccount = (connectAndValidateAccount) => {
    connectAndValidateAccount(result => {
      if (result === "success") {
        // success
        console.log("Callback SUCCESS");
      } else if (result === "error") {
        // error
        console.log("Callback ERROR");
      }
    })
  }   

const renderContent = (account, accountValidated, accountBalanceLow, accountBalance, connectAndValidateAccount) => {
    if (account && accountValidated) {
      return (
        <AccountOverview
          account={account}
          accountBalanceLow={accountBalanceLow}
          accountBalance={accountBalance}
        />
      )
    } else {
      return (
        <Button size="small" 
        onClick={() => {
            handleConnectAccount(connectAndValidateAccount);
          }}
        >
          Connect your wallet
        </Button>
      )
    }
}  

function OutplayLoginHeader({ 
    drizzle, 
    address, 
    accountBalance,
    accountBalanceLow,
    accountValidated,
    connectAndValidateAccount }) {
        
    const [account, setAccount] = useState(null);
    const [balance, setBalance] = useState(null);
    
    useEffect(() => {
        if (address) {
        setAccount(address);
        }
    }, [address]);
    
    useEffect(() => {
        if (accountBalance) {
            setBalance(accountBalance.toString())
        }
    }, [accountBalance]);

    useEffect(() => {

      console.log(drizzle)

      if (drizzle.contracts.Tournaments)
        {
            console.log(drizzle.contracts.Tournaments)

            // get initial contract
            const tournamentContract = drizzle.contracts.Tournaments;
            const contractAddress = tournamentContract.address;
            const contractAbi = tournamentContract.abi;

            // // Init the contract after the web3 provider has been determined
            this.props.initContract(contractAddress, contractAbi).then(() => {
            // Can finally interact with contract
            //   this.getNumber();
            });       
        }

    }, [drizzle]);

    return (
      <RimbleWeb3.Consumer>
        {({
          contract,
          account,
          transactions,
          initContract,
          initAccount,
          contractMethodSendWrapper
        }) => (
            <StyledHeader justifyContent={"space-between"} p={3} bg={"white"}>
            {/* <Image src={logo} /> */}
            <Text
                      fontWeight={600}
                      fontSize={"32px"}
                      color={"#2B2C36"}
                      lineHeight={1}
                    >
                     OP Arcade
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
                <>
                {renderContent(
                    account, 
                    accountValidated, 
                    accountBalanceLow, 
                    accountBalance, 
                    connectAndValidateAccount)}
                </>
            )}
          </StyledHeader>

        )}
      </RimbleWeb3.Consumer>
    );
}

/*
 * Export connected component.
 */
const mapStateToProps = state => {
    console.log("state", state);
    return {
      drizzleStatus: state.drizzleStatus,
      account: state.accounts[0],
      accountBalances: state.accountBalances
    };
  };
  
  export default drizzleConnect(OutplayLoginHeader, mapStateToProps);
  

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
            <TransactionToastUtil transactions={transactions} />
          </div>

          */