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
  web3: any;
}

interface IState {
  sessionData: any;
  contract: any;
}

export default class GameResult extends React.Component<IProps, IState> {
  constructor(props) {
    super(props)

    this.state = {
      sessionData: null,
      contract: null,
    }
  }

  componentDidMount = () => {
    const { gameSessionId, playerAddress, web3 } = this.props
    this.updateScore(gameSessionId, playerAddress)
    this.initContract(web3)
  }

  componentWillReceiveProps = (newProps) => {
    const { gameSessionId, playerAddress, web3 } = this.props
    const { gameSessionId: newGameSessionId, 
      playerAddress: newPlayerAddress, web3: newWeb3 } = newProps

    if (gameSessionId !== newGameSessionId ||
      playerAddress !== newPlayerAddress) {
      this.updateScore(newGameSessionId, newPlayerAddress)
    }
    if (newWeb3 !== web3) {
      this.initContract(newWeb3)
    }
  }

  initContract = async (web3) => {
    if (!web3) {
      return
    }
    const contract = await getTournamentContract(web3)
    this.setState({ contract })
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
      onToggle, gameSessionId } = this.props
    const { contract } = this.state

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