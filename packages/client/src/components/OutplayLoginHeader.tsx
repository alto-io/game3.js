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

import { navigateTo } from '../helpers/utilities';

// const StyledHeader = styled(Flex)`
// border-bottom: 1px solid #d6d6d6;
// box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.01);
// `;

// const StyledLink = styled(Link)`
// display: flex;
// flex-direction: row;
// align-items: center;
// &:hover {
//   text-decoration: none;
// }
// `;


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
      navigateTo('/');
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
      
    handleResize = () => {
      this.setState({
        width: window.innerWidth,
        height: window.innerHeight
      })
    }

    componentDidMount () {
      window.addEventListener('resize', this.handleResize)

      this.setState({
        width: window.innerWidth,
        height: window.innerHeight
      })
    }

    componentWillUnmount () {
      window.removeEventListener('resize', this.handleResize)
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
        account,
        accountBalance,
        accountValidated,
        transactions
        } = this.props;     

    return (
        <>
          {this.state.width > 768 ? (
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
    );
  }
}

export default OutplayLoginHeader;