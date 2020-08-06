import * as React from 'react'

import { RouteComponentProps } from '@reach/router'

import Modal from './Modal'
import { getGameSession } from "../helpers/database"
import { View, Button } from '../components'

interface IProps extends RouteComponentProps {
  show: boolean;
  onToggle?: any;
  playerAddress: string;
  gameSessionId: string;
  recordFileHash: string;
  tournamentId: string;
}

interface IState {
  sessionData: any;
}

export default class GameResult extends React.Component<IProps, IState> {
  constructor(props) {
    super(props)

    this.state = {
      sessionData: null
    }
  }

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
      return
    }
    const sessionData = await getGameSession(gameSessionId, playerAddress)
    this.setState({
      sessionData
    })
  }

  render () {
    const { show, onToggle } = this.props
    const { sessionData } = this.state

    const score = (sessionData && sessionData.timeLeft) || ''

    return (
      <Modal show={show} toggleModal={onToggle}>
        <View style={{ margin: '20px' }}>Game result: {score}</View>
        <View style={{ display: 'flex', flexDirection: 'row', width: '100%', margin: '0px auto'}}>
          <Button>Submit score</Button>
        </View>
      </Modal>
    )
  }
}