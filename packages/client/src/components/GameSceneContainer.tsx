import React, { Component } from 'react';

import CSS from 'csstype';

import { RouteComponentProps } from '@reach-router';

// Components
import LeavingGamePrompt from './LeavingGamePrompt';

interface IProps extends RouteComponentProps {
	viewOnly?: boolean,
	when?: any,
	tournamentId: boolean
}

export default class GameSceneContainer extends Component<IProps, any> {

	constructor(props) {
		super(props);
	}

	render() {
		const { children, viewOnly, when, tournamentId } = this.props;

		return (
			<div style={canvasContainerStyle}>
				<LeavingGamePrompt when={when} tournamentId={tournamentId} viewOnly={viewOnly}/>
				{viewOnly === undefined ? (
					<div style={canvasContainerStyle}>
						{children}	
					</div>
				) : (
					!viewOnly && (
						<div style={canvasContainerStyle}>
							{children}	
						</div>
					)
				)}
			</div>
		)
	}
}

const canvasContainerStyle: CSS.Properties = {
  width: '100%',
  height: '100%'
}