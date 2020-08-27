import React, { Component, Fragment } from 'react';
import { drizzleConnect } from "@drizzle/react-plugin";
import { Flex, Flash } from "rimble-ui";

import PlayerTournamentResults from "./PlayerTournamentResults";
import PlayerGameReplays from "./PlayerGameReplays";
import PlayerOngoingTournaments from "./PlayerOngoingTournaments";

class DashboardView extends Component {

    render() {
      
      return (
        <Flex maxWidth={"1180px"} p={3} mx={"auto"}>
          {this.props.account && this.props.accountValidated ? (
            <>
            <PlayerTournamentResults 
            drizzle={this.props.drizzle} 
            account={this.props.account} 
            setRoute={this.props.setRoute}/>

            <PlayerOngoingTournaments />
            {/* <PlayerGameReplays /> */}
            </>
          ) : (
            <Flash> You have to be logged in to view. </Flash>
          )}
        </Flex>  
      );
      }

}
/*
 * Export connected component.
 */
const mapStateToProps = state => {
    return {
    };
  };
  
  export default drizzleConnect(DashboardView, mapStateToProps);