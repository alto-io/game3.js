import React, {Component} from 'react';

import { Router } from '@reach/router'
import qs from 'querystringify';

import TournamentResultsCard from './TournamentResultsCard'

import CSS from 'csstype';

export default class GameScene extends Component<any, any> {

	constructor(props) {
		super(props);

		let params = qs.parse(window.location.search);
    const { isTournament, gameName, tournamentId } = params;

    this.state = {
    	isTournament,
    	gameName,
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
			isTournament,
			gameName,
			tournamentId
		} = this.state;

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
						isTournament={isTournament}
					/>
				</div>
			</div>
		)
	}
}

const gamescenecontainerStyle: CSS.Properties = {
  background: '#EEEEEE',
  display: 'flex',
  width: '100%'
}

const gameStyle: CSS.Properties = {
	flex: 3,
	display: 'flex',
	justifyContent: 'center',
	background: '#ff0000'
}

const leaderBoardsStyle: CSS.Properties = {
	flex: 1,
	display: 'flex',
	justifyContent: 'center',
	flexDirection: 'column',
	background: '#0000ff'
}