import React, {Component} from 'react';
import { Flex, Box } from 'rimble-ui';
import styled from 'styled-components';
import { isBrowser} from 'react-device-detect';

import qs from 'querystringify';

import TournamentResultsCard from './TournamentResultsCard';

const GameWindowContainer = styled(Flex)`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  margin: 0 auto;
  padding: 3rem 0;
  max-width: 1180px;

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
    padding: 4rem 0;

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
				<Box className="game">
					{children}
				</Box>

      {isBrowser && (
        <Box className="leaderboards">
          <TournamentResultsCard
            tournamentId={tournamentId}
            drizzle={drizzle}
            playerAddress={playerAddress}
            accountValidated={accountValidated}
            connectAndValidateAccount={connectAndValidateAccount}
            setRoute={setRoute}
          />
        </Box>
      )}
			</GameWindowContainer>
		)
	}
}