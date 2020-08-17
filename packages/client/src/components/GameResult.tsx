import * as React from 'react'

import { RouteComponentProps } from '@reach/router'

import Modal from './Modal'
import { View, Button } from '../components'

import { getGameSession, putGameReplay } from '../helpers/database'
import { getTournamentContract } from '../helpers/web3'

interface IProps extends RouteComponentProps {
  show: boolean;
  onToggle?: any;
  playerAddress: string;
  gameSessionId: string;
  recordFileHash: string;
  tournamentId: string;
  drizzle: any;
  drizzleState: any;
}

interface IState {
  sessionData: any;
}

export default class GameResult extends React.Component<IProps, IState> {
  constructor(props) {
    super(props)

    this.state = {
      sessionData: null,
    }
  }

  componentDidMount = () => {
    const { gameSessionId, playerAddress } = this.props
    this.updateScore(gameSessionId, playerAddress)
  }

  componentWillReceiveProps = (newProps) => {
    const { gameSessionId, playerAddress } = this.props
    const { gameSessionId: newGameSessionId, 
      playerAddress: newPlayerAddress } = newProps

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

  submitResult = async () => {
    const { tournamentId, recordFileHash, playerAddress,
      onToggle, gameSessionId, drizzle } = this.props

    const contract = drizzle.contracts.Tournaments;

    const result = await putGameReplay(gameSessionId, playerAddress, recordFileHash)
    console.log(result)

    contract.methods.submitResult(tournamentId, gameSessionId)
      .send({
        from: playerAddress
      })
    onToggle(true)
  }

  render () {
    const { show, onToggle } = this.props
    const { sessionData } = this.state

    const score = (sessionData && sessionData.timeLeft) || ''

    return (
      <Modal show={show} toggleModal={onToggle}>
        <View style={{ margin: '20px' }}>Game result: {score}</View>
        <View style={{ display: 'flex', flexDirection: 'row', width: '100%', margin: '0px auto'}}>
          <Button onClick={this.submitResult}>Submit score</Button>
        </View>
      </Modal>
    )
  }
}