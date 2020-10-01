import React, { Component } from "react";
import { Flex, Link, Image } from "rimble-ui";
import { isMobile } from 'react-device-detect';

import NavBarHamburger from "./NavBarHamburger";
import NavBarDropdown from "./NavBarDropdown";
import ConnectWalletButton from "./ConnectWalletButton";

class OutplayLoginHeaderMobile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false
    }
    this.handleBurger = this.handleBurger.bind(this);
  }

  handleBurger(e) {
    this.setState({isOpen: !this.state.isOpen});
  }

  render () {
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

    return (
      <>
        <Flex justifyContent={"space-between"} p={3} bg={"white"}>
          <Link title={ "Back to Home" }>
            <Image 
                pr={2}
                borderColor={"white"}
                overflow={"hidden"}
                src={logo}
                onClick={handleClickLogo}
            />
          </Link>

          <Flex>
            {(account && accountValidated && !isMobile) || (address !== null && connected && isMobile) ? "" : (
            <ConnectWalletButton handleConnectAccount={handleConnectAccount} rimbleInitialized={rimbleInitialized}/>
            )}

            <NavBarHamburger handleBurger={this.handleBurger} isOpen={this.state.isOpen}/>
          </Flex> 
        </Flex>

        <NavBarDropdown
          account={account}
          accountBalance={accountBalance}
          accountValidated={accountValidated}
          shortenAddress={shortenAddress}
          balanceIcon={balanceIcon}
          walletIcon={walletIcon}
          isOpen={this.state.isOpen}
          address={address}
          balance={balance}
          connected={connected}
          killSession={killSession}
        />
      </>
    )
  }
}

export default OutplayLoginHeaderMobile;