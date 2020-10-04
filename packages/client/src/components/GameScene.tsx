import React, { Component } from 'react';
import { Flex, Box } from 'rimble-ui';
import styled from 'styled-components';
import MediaQuery from 'react-responsive'

import qs from 'querystringify';

import TournamentResultsCard from './TournamentResultsCard';
import FloatingActionButton from './FloatingActionButton';

const GameWindowContainer = styled(Flex)`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  margin: 0 auto;
  padding: 3rem 0;
  max-width: 1180px;

  .fab {

  }

  .game {
    width: 100%:
  }

  .leaderboards {
    margin-top: 1.5rem;
    width: 80%;
  }

  @media screen and (min-width: 950px) {
    flex-direction: row;
    justify-content: space-around;
    align-items: flex-start;

    .game {
      width: 65%;
    }

    .leaderboards {
      width: 30%;
      margin-top: 0;
    }
  }
`

interface IProps {
  children: any;
  drizzle: any;
  playerAddress?: string;
  accountValidated: any;
  connectAndValidateAccount: any;
  setRoute: any;
  gqlContext: any;
}

interface IState {
  tournamentId?: string;
}

export default class GameScene extends Component<IProps, IState> {

  constructor(props) {
    super(props);

    let params = qs.parse(window.location.search);
    const { tournamentId } = params;

    this.state = {
      tournamentId
    }
  }

  render() {
    const {
      children,
      drizzle,
      playerAddress,
      accountValidated,
      connectAndValidateAccount,
      setRoute
    } = this.props;

    const {
      tournamentId
    } = this.state;

    return (
      
      <GameWindowContainer>
        <MediaQuery maxDeviceWidth={728}>
          <FloatingActionButton>
            <TournamentResultsCard
              tournamentId={tournamentId}
              drizzle={drizzle}
              playerAddress={playerAddress}
              accountValidated={accountValidated}
              connectAndValidateAccount={connectAndValidateAccount}
              setRoute={setRoute}
              gqlContext={this.props.gqlContext}
            />
          </FloatingActionButton>
        </MediaQuery>
        <Box className="game">
          {children}
        </Box>

        <MediaQuery minDeviceWidth={728}>
          <Box className="leaderboards">
            <TournamentResultsCard
              tournamentId={tournamentId}
              drizzle={drizzle}
              playerAddress={playerAddress}
              accountValidated={accountValidated}
              connectAndValidateAccount={connectAndValidateAccount}
              setRoute={setRoute}
              gqlContext={this.props.gqlContext}
            />
          </Box>
        </MediaQuery>
      </GameWindowContainer>
    )
  }
}