import React, {Component} from 'react';

import { Router } from '@reach/router'
import qs from 'querystringify';

import TournamentResultsCard from './TournamentResultsCard'

import CSS from 'csstype';
import { baseColors } from '../styles';

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
  background: `rgb(${baseColors.lightGrey})`,
  display: 'flex',
	width: '100%',
	padding: '2rem 0'
}

const gameStyle: CSS.Properties = {
	flex: 3,
	display: 'flex',
	justifyContent: 'center',
	margin: '5px 0 5px 5px'
}

const leaderBoardsStyle: CSS.Properties = {
	flex: 1,
	display: 'flex',
	justifyContent: 'center',
	flexDirection: 'column',
	margin: '5px 5px 0 5px'
}