import React, { Component } from "react";
import { Flex, Button, Link, Image, Box, Text } from "rimble-ui";
import styled  from "styled-components";

import NavBarHamburger from "./NavBarHamburger";
import NavBarDropdown from "./NavBarDropdown";
import ConnectWalletButton from "./ConnectWalletButton";

const StyledButton = styled(Button)`
  font-family: 'Apercu Light';
  font-size: 0.75rem;
  letter-spacing: 0.4px;
  text-transform: uppercase;
`

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
      walletIcon
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
            {account && accountBalance ? "" : (
            <ConnectWalletButton handleConnectAccount={handleConnectAccount}/>
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
        />
      </>
    )
  }
}

export default OutplayLoginHeaderMobile;