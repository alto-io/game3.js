import React from "react";
import styled from "styled-components";
import { Flex, Box, Link } from "rimble-ui";

const StyledLinkContainer = styled(Box)`
  background: ${props =>
    props.routeName === props.route ? props.theme.colors.primary : ""};
  a,
  a:hover {
    color: ${props =>
      props.routeName === props.route ? "white" : props.theme.colors.primary};
    text-decoration: none;
  }
`;

const OutplayNavigation = ({ route, setRoute }) => {
  return (
    <Flex justifyContent={"center"} p={3} mb={"70px"}>
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
        routeName={"Dashboard"}
        route={route}
        borderRadius={1}
      >
        <Link
          href={"dashboard"}
          p={3}
          onClick={e => {
            e.preventDefault();
            setRoute("Dashboard");
          }}
        >
          Dashboard
        </Link>
      </StyledLinkContainer>
      <StyledLinkContainer
        mx={3}
        routeName={"Wallet"}
        route={route}
        borderRadius={2}
      >
        <Link
          href={"wallet"}
          p={3}
          onClick={e => {
            e.preventDefault();
            setRoute("Wallet");
          }}
        >
          Wallet
        </Link>
      </StyledLinkContainer>
     
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


    </Flex>
  );
};

export default OutplayNavigation;
