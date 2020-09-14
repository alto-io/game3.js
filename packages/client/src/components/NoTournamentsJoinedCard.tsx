import React, { Component } from 'react';
import { Flex, Heading, Button } from 'rimble-ui';

interface IProps {
  setRoute: any;
}

class NoTournamentsJoinedCard extends Component<IProps> {
  render(){
    return(
      <Flex mt={3} justfyContent={"center"} flexDirection={"column"} alignItems={"center"}>
        <Heading as={"h3"}>You haven't joined any tournaments.</Heading>
        <Button className="btn-custom"
          alignSelf={"center"} 
          mt={3}
          onClick={e => {
            e.preventDefault();
            this.props.setRoute("TournamentView");
          }}
          >Join a Tournament</Button>
      </Flex>
    )
  }
}

export default NoTournamentsJoinedCard;