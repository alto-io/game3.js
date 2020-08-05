import * as React from 'react'

import { RouteComponentProps } from '@reach/router'

import Modal from './Modal'
import { getGameSession } from "../helpers/database"

interface IProps extends RouteComponentProps {
  show: boolean;
  onToggle?: any;
  playerAddress: string;
  gameSessionId: string;
  recordFileHash: string;
  tournamentId: string;
}

export default class GameResult extends React.Component<IProps> {

  componentDidMount = () => {
    const { gameSessionId, playerAddress } = this.props
    this.updateScore(gameSessionId, playerAddress)
  }

  componentWillReceiveProps = (newProps) => {
    const { gameSessionId, playerAddress } = this.props
    const newGameSessionId = newProps.gameSessionId
    const newPlayerAddress = newProps.playerAddress

    if (gameSessionId !== newGameSessionId ||
      playerAddress !== newPlayerAddress) {
      this.updateScore(newGameSessionId, newPlayerAddress)
    }
  }

  updateScore = async (gameSessionId, playerAddress) => {
    if (!gameSessionId || !playerAddress) {
      console.log(`gameSessionId: ${gameSessionId}, playerAddress: ${playerAddress}`)
      return
    }
    const sessionData = await getGameSession(gameSessionId, playerAddress)
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