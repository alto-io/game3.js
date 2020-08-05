import * as React from 'react'

import { RouteComponentProps } from '@reach/router'

import Modal from './Modal'
import { getGameSession } from "../helpers/database"

interface IProps extends RouteComponentProps {
  show: boolean;
  onToggle?: any;
  playerId: string;
  gameSessionId: string;
  recordFileHash: string;
  tournamentId: string;
}

export default class GameResult extends React.Component<IProps> {

  componentDidMount = () => {
    const { gameSessionId, playerId } = this.props
    this.updateScore(gameSessionId, playerId)
  }

  componentWillReceiveProps = (newProps) => {
    const { gameSessionId, playerId } = this.props
    const newGameSessionId = newProps.gameSessionId
    const newPlayerId = newProps.newPlayerId

    if (gameSessionId !== newGameSessionId ||
      playerId !== newPlayerId) {
      this.updateScore(newGameSessionId, newPlayerId)
    }
  }

  updateScore = async (gameSessionId, playerId) => {
    if (!gameSessionId || !playerId) {
      console.log(`gameSessionId: ${gameSessionId}, playerId: ${playerId}`)
      return
    }
    const sessionData = await getGameSession(gameSessionId, playerId)
    console.log(sessionData)
  }

  render () {
    const { show, onToggle } = this.props
    return (
      <Modal show={show} toggleModal={onToggle}>
        <div>Game result</div>
      </Modal>
    )
  }
}