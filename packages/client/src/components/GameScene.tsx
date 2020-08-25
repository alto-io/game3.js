import React, {Component} from 'react';

import { Router } from '@reach/router'

import TournamentResultsCard from './TournamentResultsCard'

import CSS from 'csstype';

export default class GameScene extends Component<any, any> {

	constructor(props) {
		super(props);
	}

	render() {
		const {
			children,
			tournamentId,
			drizzle,
			playerAddress
		} = this.props;

		return (
			<div style={gamescenecontainerStyle}>
				<div style={gameStyle}>
					{children}
				</div>
				<div style={leaderBoardsStyle}>
					<TournamentResultsCard
						tournamentId={tournamentId}
						drizzle={drizzle}
						playerAddress={playerAddress}
					/>
				</div>
			</div>
		)
	}
}

const gamescenecontainerStyle: CSS.Properties = {
  background: '#EEEEEE',
  display: 'flex',
  flexDirection: 'row'
}

const gameStyle: CSS.Properties = {
	flex: 1,
	background: '#333' // just to see what's going on
}

const leaderBoardsStyle: CSS.Properties = {
	flex: 1,
	background: '#123456' // just to see what's going on
}