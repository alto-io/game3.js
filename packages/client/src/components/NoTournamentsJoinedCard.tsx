import React, { Component } from 'react';
import { Flex, Heading, Button } from 'rimble-ui';
import styled from 'styled-components';

const StyledButton = styled(Button)`
  font-family: 'Apercu Light';
  font-size: 0.75rem;
  letter-spacing: 0.4px;
  text-transform: uppercase;
`

class NoTournamentsJoinedCard extends Component {
  render(){
    return(
      <Flex mt={3} justfyContent={"center"} flexDirection={"column"} alignItems={"center"}>
        <Heading as={"h3"}>You haven't joined any tournaments.</Heading>
        <StyledButton 
          alignSelf={"center"} 
          mt={3}
          onClick={e => {
            e.preventDefault();
            this.props.setRoute("TournamentView");
          }}
          >Join a Tournament</StyledButton>
      </Flex>
    )
  }
}

export default NoTournamentsJoinedCard;