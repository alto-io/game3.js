import React, { Component } from "react";
import { Link, Box, Button } from "rimble-ui";
import { isMobile } from 'react-device-detect';
import styled from "styled-components";

const StyledBox = styled(Box)`
  position: relative;
  width: 100%;
  
  ul {
    height: 0;
    transition: 400ms ease-in-out;
  } 

  li {
    background-color: #fff;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    height: 0;
    opacity: 0;
    padding: 0.75rem;
    transition: 300ms ease-in-out;
    transform: translateY(-50px);
    width: 100%;
  }

  .active {
    height: 15vh;
    padding-bottom: 1rem;
    margin-bottom: 2rem;

    li {
      opacity: 1;
      height: 44px;
      transform: translateY(0);
    }

    .wallet {
      margin-top: 2.5rem;
    }
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

  img {
    width: 1.25rem;
    height: 1.25rem;
    margin-right: 0.5rem;
  }

  .title {
    color: #2b2c36;
    font-weight: 600;
  }

  .wallet {
    margin-top: 0;
  }
`

const StyledTextLink = styled(Link)`
  transition: 300ms ease;
  &:hover {
    text-decoration: none;
  }
`

const StyledButtonText = styled(Button.Text)`
  letter-spacing: 0.5px;
  text-transform: capitalize;
  transition: 300ms ease;

  &:hover {
    color: #7065D8;
    text-decoration: none;
  }
`

interface IProps {
  account: any;
  accountBalance: any;
  accountValidated: any;
  shortenAddress: any;
  balanceIcon: any;
  walletIcon: any;
  isOpen: boolean;
  address: any;
  balance: any;
  connected: any;
  killSession: any;
}

class NavBarDropdown extends Component<IProps> {
  render() {
    const {
      account, 
      accountBalance,
      accountValidated,
      shortenAddress, 
      balanceIcon,
      walletIcon,
      isOpen,
      address,
      balance,
      connected,
      killSession
    } = this.props;

    return(
      <StyledBox>
        <Dropdown className={isOpen ? "active" : ""}>
        {account && accountValidated && !isMobile ? (
          <>
            {/* ID */}
            <li className="wallet">
              <img src={walletIcon} alt="wallet-icon"/>
              <p><span className="title">Connected as </span>{shortenAddress(account)}</p>
            </li>

            {/* Balance */}
            <li>
              <img src={balanceIcon} alt="balance-icon"/>
              <p><span className="title">Balance </span>{accountBalance.toString()} ETH</p>
            </li>
          </>
        ) : ""}
        { balance && connected &&isMobile ? (
          <>
            {/* ID */}
            <li className="wallet">
              <img src={walletIcon} alt="wallet-icon"/>
              <p><span className="title">Connected as </span>{address !== null ? shortenAddress(address) : ""}</p>
            </li>

            {/* Balance */}
            <li>
              <img src={balanceIcon} alt="balance-icon"/>
              <p><span className="title">Balance </span>{balance.toString()} ETH</p>
            </li>

            <li>
              <StyledButtonText onClick={e => {e.preventDefault(); killSession()}}>Disconnect</StyledButtonText>
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
      </StyledBox>
    )
  }
}

export default NavBarDropdown;