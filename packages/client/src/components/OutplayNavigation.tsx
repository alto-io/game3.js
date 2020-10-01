import React from "react";
import styled from "styled-components";
import { Flex, Box, Link } from "rimble-ui";
import { isMobile } from 'react-device-detect';

const StyledLinkContainer = styled(Box)`
  background: ${props =>
    // props.routeName === props.route ? props.theme.colors.primary : ""};
    props.routeName === props.route ? "#0093d5" : ""};
  padding: 0.5rem 1rem;  
  a {
    color: ${props =>
      props.routeName === props.route ? "#fff" : "#a8a8a8"};
  }
  a:hover {
    color: ${props =>
      // props.routeName === props.route ? "white" : props.theme.colors.primary};
      props.routeName === props.route ? "#fff" :"#0093d5"};
    text-decoration: none;
    transition: 300ms ease;
  }

  @media screen and (min-width: 768px) {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0;
    text-align: center;
  }
`;

const StyledNavigation = styled(Flex)`
  box-shadow: 0 4px 16px rgba(0,0,0,0.1);
  flex-direction: column;
  margin-bottom: 2rem;

  a {
    font-size: 1.266rem;
  }

  a.disabled {
    color: #ddd;
    pointer-events: none;
  }

  @media screen and (min-width: 768px) {
    flex-direction: row;
    margin-bottom: 4.375rem;

    a {
      font-size: 1rem;
    }
  }
`;

const OutplayNavigation = ({ route, setRoute, account, accountValidated, handleOpenModal, isContractOwner, connected, address }) => {
  return (
    <StyledNavigation justifyContent={"center"} p={3}>
      <StyledLinkContainer
        mx={3}
        routeName={"Play"}
        route={route}
        borderRadius={1}
      >
        <Link
          href={"play"}
          p={3}
          onClick={e => {
            e.preventDefault();
            setRoute("Play");
          }}
        >
          Play
        </Link>
      </StyledLinkContainer>
      <StyledLinkContainer
        mx={3}
        routeName={"TournamentView"}
        route={route}
        borderRadius={1}
      >
        <Link
          href={"tournaments"}
          p={3}
          onClick={e => {
            e.preventDefault();
            setRoute("TournamentView");
          }}
        >
          Tournaments
        </Link>
      </StyledLinkContainer>
      <StyledLinkContainer
        mx={3}
        routeName={"DashboardView"}
        route={route}
        borderRadius={1}
      >
        <Link
          href={"dashboard"}
          p={3}
          onClick={e => {
            e.preventDefault();
            setRoute("DashboardView");
          }}
          className={(!connected && address === "" && isMobile) || (!account && !accountValidated && !isMobile)? "disabled" : ""}
        >
          Dashboard
        </Link>
      </StyledLinkContainer>
      <StyledLinkContainer
        mx={3}
        routeName={"WalletView"}
        route={route}
        borderRadius={2}
      >
        <Link
          href={"wallet"}
          p={3}
          onClick={e => {
            e.preventDefault();
            setRoute("WalletView");
          }}
          className={(!connected && address === "" && isMobile) || (!account && !accountValidated && !isMobile) ? "disabled" : ""}
        >
          Wallet
        </Link>
      </StyledLinkContainer>
     
     { isContractOwner === true ? (
       <StyledLinkContainer
        mx={3}
        routeName={"CreateTourneyView"}
        route={route}
        borderRadius={2}
        >
          <Link
            href={"createtourney"}
            p={3}
            onClick={e => {
              e.preventDefault();
              setRoute("CreateTourneyView");
            }}
          >
            Create Tourney
          </Link>
        </StyledLinkContainer>
      ) : ""}
      
    </StyledNavigation>
  );
};

export default OutplayNavigation;
