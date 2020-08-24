import React, { Component } from "react";
import { Flex, Button, Link, Image, Box, Text } from "rimble-ui";
import styled  from "styled-components";

import NavBarHamburger from "./NavBarHamburger";

const StyledButton = styled(Button)`
  font-family: 'Apercu Light';
  font-size: 0.75rem;
  letter-spacing: 0.4px;
  text-transform: uppercase;
`

const StyledTextLink = styled(Link)`
  &:hover {
    text-decoration: none;
  }
`
const Dropdown = styled.ul`
  background-color: #fff;
  color: #4E174F;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: flex-end;
  font-size: 1rem;
  list-style: none;
  letter-spacing: 0.5px;
  margin: 0;

  li {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    padding: 0.75rem;
    width: 100%;
  }

  img {
    width: 1.25rem;
    height: 1.25rem;
    margin-right: 0.5rem;
  }

  .title {
    color: #2b2c36;
    font-weight: 600;
  }
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
            {account && accountValidated ? "" : (
            <StyledButton 
                color="primary"
                size="small"
                mr={3}
                onClick={handleConnectAccount}>
             Connect your Wallet
            </StyledButton>
            )}
            

            <NavBarHamburger handleBurger={this.handleBurger} isOpen={this.state.isOpen}/>
          </Flex> 
        </Flex>

        <Dropdown>
          {account && accountValidated ? (
            <>
              {/* ID */}
              <li>
                <img src={walletIcon} alt="wallet-icon"/>
                <p><span className="title">Connected as </span>{shortenAddress(account)}</p>
              </li>

              {/* Balance */}
              <li>
                <img src={balanceIcon} mr={2} alt="balance-icon"/>
                <p><span className="title">Balance </span>{accountBalance.toString()} ETH</p>
              </li>
            </>
          ) : ""}
          <li>
            <StyledTextLink 
                href="https://outplay.games" 
                target="_blank"
                title={"To outplay.games"}
                fontSize={"1rem"}
                mr={3}
            >
              About Us
            </StyledTextLink>
          </li>
        </Dropdown>
      </>
    )
  }
}

export default OutplayLoginHeaderMobile;