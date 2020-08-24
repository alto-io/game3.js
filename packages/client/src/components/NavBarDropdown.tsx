import React, { Component } from "react";
import { Link, Box } from "rimble-ui";
import styled from "styled-components";

const StyledBox = styled(Box)`
  position: relative;
  width: 100%;
  
  ul {
    height: 0;
    transition: 400ms ease-in-out;
  } 

  li {
    transition: 300ms ease-in-out;
    opacity: 0
  }

  .active {
    height: 10vh;
    padding-bottom: 1rem;

    li {
      opacity: 1;
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

const StyledTextLink = styled(Link)`
  transition: 300ms ease;
  &:hover {
    text-decoration: none;
  }
`

class NavBarDropdown extends Component {
  render() {
    const {
      account, 
      accountBalance,
      accountValidated,
      shortenAddress, 
      balanceIcon,
      walletIcon,
      isOpen
    } = this.props;

    return(
      <StyledBox>
        <Dropdown className={isOpen ? "active" : ""}>
        {account && accountValidated ? (
          <>
            {/* ID */}
            <li>
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