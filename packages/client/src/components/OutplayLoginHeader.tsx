import React from "react";
import { Card, Text, Box, Button, Flex, Image, Link } from "rimble-ui";
import OutplayLoginHeaderDesktop from "./OutplayLoginHeaderDesktop";
import OutplayLoginHeaderMobile from "./OutplayLoginHeaderMobile";

import RimbleWeb3 from "../rimble/RimbleWeb3";

import TransactionToastUtil from "../rimble/TransactionToastUtil";
import SmartContractControls from "./SmartContractControls";
import TransactionsCard from "./TransactionsCard";

import AccountOverview from "../rimble/components/AccountOverview";

import logo from './../images/op-logo.png';
import walletIcon from "./../images/icon-wallet.svg";
import balanceIcon from "./../images/icon-balance.svg";
import shortenAddress from "../core/utilities/shortenAddress";
import { navigate } from '@reach/router';
import { ScreenSizeContext } from './ScreenSizeProvider'
import ScreenSizeProvider from './ScreenSizeProvider';

class OutplayLoginHeader extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      width: window.innerWidth,
      height: window.innerHeight
    };
  }

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
      return (
        <ScreenSizeProvider>
          <ScreenSizeContext.Consumer>{(context) => {
            const {
            account,
            accountBalance,
            accountValidated,
            transactions
            } = this.props; 

            return (
              <>
              {this.context.width > 768 ? (
              <OutplayLoginHeaderDesktop 
              account={account}
              accountBalance={accountBalance}
              accountValidated={accountValidated}
              handleClickLogo={this.handleClickLogo}
              handleConnectAccount={this.handleConnectAccount}
              logo={logo}
              walletIcon={walletIcon}
              balanceIcon={balanceIcon}
              shortenAddress={shortenAddress}
            />
                      
            ) : <OutplayLoginHeaderMobile 
              account={account}
              accountBalance={accountBalance}
              accountValidated={accountValidated}
              handleClickLogo={this.handleClickLogo}
              handleConnectAccount={this.handleConnectAccount}
              logo={logo}
              walletIcon={walletIcon}
              balanceIcon={balanceIcon}
              shortenAddress={shortenAddress}
            />}
            <TransactionToastUtil transactions={transactions} />
            </>
            )
          }}
          </ScreenSizeContext.Consumer>
        </ScreenSizeProvider>
      );
    }
}

export default OutplayLoginHeader;