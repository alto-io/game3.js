import React, { Component } from 'react';
import { Box } from 'rimble-ui';
import styled from 'styled-components';

import { RouteComponentProps } from '@reach-router';

// Components
import LeavingGamePrompt from './LeavingGamePrompt';

const CanvasContainerStyle = styled(Box)`
  width: 100%;
  height: 100%;

  .container {
    width: 100%;
    height: 100%;

    canvas {
      width: 100%;
      height: 100%;
		}
		
		@media screen and (min-width: 720px) {
			canvas {
				width: 100vw;
				height: 100vh;
			}	
		}
  }
`

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
			<CanvasContainerStyle className="canvas-container">
				<LeavingGamePrompt when={when} tournamentId={tournamentId} viewOnly={viewOnly}/>
				{viewOnly === undefined ? (
          <div className="container">
            {children}
          </div>
				) : (
					!viewOnly && (
            <div className="container">
              {children}	
            </div>
					)
				)}
			</CanvasContainerStyle>
		)
	}
}