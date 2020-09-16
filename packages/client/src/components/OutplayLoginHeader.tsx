import React from "react";
import OutplayLoginHeaderDesktop from "./OutplayLoginHeaderDesktop";
import OutplayLoginHeaderMobile from "./OutplayLoginHeaderMobile";


import TransactionToastUtil from "../rimble/TransactionToastUtil";

import logo from './../images/op-logo.png';
import walletIcon from "./../images/icon-wallet.svg";
import balanceIcon from "./../images/icon-balance.svg";
import shortenAddress from "../core/utilities/shortenAddress";

import { navigateTo } from '../helpers/utilities';

import { drizzleConnect } from "@drizzle/react-plugin";
import web3 from 'web3';

class OutplayLoginHeader extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      width: window.innerWidth,
      height: window.innerHeight,
      rimbleInitialized: false,
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
      window.addEventListener('resize', this.handleResize);

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
                this.setState({ rimbleInitialized: true });
            }
        }
      }    

    render() {
    const {
        account,
        accountBalances,
        accountValidated,
        transactions
        } = this.props;     
       
        let accountBalance = null

        if (account && accountBalances[account])
        {
          accountBalance = web3.utils.fromWei(accountBalances[account].toString(), "ether")
        }

        console.log(this.state.rimbleInitialized);
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
            rimbleInitialized={this.state.rimbleInitialized}
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
            rimbleInitialized={this.state.rimbleInitialized}
          />}


          <TransactionToastUtil transactions={transactions} />
        </>
    );
  }
}

/*
 * Export connected component.
 */
const mapStateToProps = state => {
  return {
    drizzleStatus: state.drizzleStatus,
    account: state.accounts[0],
    accountBalances: state.accountBalances
  };
};



export default drizzleConnect(OutplayLoginHeader, mapStateToProps);