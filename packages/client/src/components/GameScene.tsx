import React, {Component} from 'react';
import { Flex, Box } from 'rimble-ui';
import styled from 'styled-components';

import { Router } from '@reach/router'
import qs from 'querystringify';
import { DEFAULT_GAME_DIMENSION } from '../constants'

import TournamentResultsCard from './TournamentResultsCard';

const GameWindowContainer = styled(Flex)`
  background: #d3d3d3;
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
    width: 100%;
  }

  @media screen and (min-width: 950px) {
    flex-direction: row;
    justify-content: center;
    align-items: flex-start;

    .game {
      width: 65%;
    }

    .leaderboards {
      width: 30%;
    }
  }
`

// import CSS from 'csstype';
// import { baseColors } from '../styles';

export default class GameScene extends Component<any, any> {

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
			playerAddress
		} = this.props;

		const {
			tournamentId
		} = this.state;

		return (
			<GameWindowContainer>
				<Box className="game">
					{children}
				</Box>

        <Box className="leaderboards">
          <TournamentResultsCard
            tournamentId={tournamentId}
            drizzle={drizzle}
            playerAddress={playerAddress}
          />
        </Box>
			</GameWindowContainer>
		)
	}
}

// const gamescenecontainerStyle: CSS.Properties = {
//   background: `rgb(${baseColors.lightGrey})`,
//   display: 'flex',
// 	width: '100%',
// 	padding: '2rem 0'
// }

// const gameStyle: CSS.Properties = {
// 	flex: 3,
// 	display: 'flex',
// 	justifyContent: 'center',
// 	margin: '5px 0 5px 5px'
// }

// const leaderBoardsStyle: CSS.Properties = {
// 	flex: 1,
// 	display: 'flex',
// 	justifyContent: 'center',
// 	flexDirection: 'column',
// 	margin: '5px 5px 0 5px'
// }