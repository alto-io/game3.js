import * as React from 'react'

import { RouteComponentProps } from '@reach/router'

import { View, Button } from '../components'
import { getGameSession } from '../helpers/database'

interface IProps extends RouteComponentProps {
  result: any;
  onPlayResult: any;
  onDeclareWinner: any;
  canDeclareWinner: any;
  web3: any;
}

interface IState {
  sessionData: any;
  isLoading: boolean;
}

export default class TournamentResult extends React.Component<IProps, IState> {
  constructor(props) {
    super(props)

    this.state = {
      sessionData: null,
      isLoading: false,
    }
  }

  componentDidMount() {
    const { result } = this.props
    const { playerAddress, sessionId } = result

    this.updateScore(sessionId, playerAddress)
  }

  componentWillReceiveProps(newProps) {
    const { result } = this.props
    const { result: newResult } = newProps
    if (result.sessionId === newResult.sessionId) {
      return
    }

    const { playerAddress, sessionId } = newResult
    this.updateScore(sessionId, playerAddress)
  }

  updateScore = async (gameSessionId, playerAddress) => {
    if (!gameSessionId || !playerAddress) {
      return
    }
    this.setState({
      isLoading: true
    })
    const sessionData = await getGameSession(gameSessionId, playerAddress)
    this.setState({
      sessionData,
      isLoading: false
    })
  }

  render () {
    const { result, onPlayResult, onDeclareWinner, canDeclareWinner } = this.props
    const { tournamentId, resultId, isWinner, playerAddress } = result
    const { sessionData, isLoading } = this.state

    const score = (sessionData && sessionData.timeLeft) || ''

    if (isLoading) {
      return (
        <View
          flex={true}
          column={true}
          style={{
            borderRadius: 4,
            backgroundColor: '#efefef',
            marginTop: '5px',
            marginBottom: '5px',
            padding: '10px'
          }}>
            <View flex={true}>Loading...</View>
        </View>
      )
    }

    return (
        <View
          flex={true}
          column={true}
          style={{
            borderRadius: 4,
            backgroundColor: '#efefef',
            marginTop: '5px',
            marginBottom: '5px',
            padding: '10px'
          }}>
            <View flex={true}>Player: {playerAddress}</View>
            <View flex={true}>Score: {score}</View>
            <View flex={true} style={{width: '100%'}}>
            <View flex={true}>Replay: </View>
            <View flex={true} style={{ flexGrow: 1 }} ><div/></View>
            <View flex={true}>
              {sessionData && (<Button
                title="Watch replay"
                onClick={() => {onPlayResult(sessionData.replayHash)}}
                text={'Watch'}
              />)}
            </View>
            {!isWinner && canDeclareWinner && (
              <View flex={true}>
                <Button
                  title="Declare winner"
                  onClick={() => {onDeclareWinner(tournamentId, resultId)}}
                  text={'Declare winner'}
                />
              </View>
            )}
            </View>
        </View>
    )
  }
}
