import * as React from 'react'

import { RouteComponentProps } from '@reach/router'

import Modal from './Modal';
import { View, Button } from '../components';
import GameJavascript, { GameJavascriptContext } from '../scenes/GameJavascript';
import { navigateTo } from '../helpers/utilities';

import {
  updateGameNo,
  getGameNo,
  getGameSession,
  putGameReplay,
  updateSessionScore
} from '../helpers/database'

export default class GameResult extends React.Component<any, any> {
  constructor(props) {
    super(props)

    this.state = {
      sessionData: null,
      tourneyMaxTries: 0
    }
  }

  componentDidMount = async () => {
    const { gameSessionId, playerAddress, tournamentId, didWin } = this.props;
    await this.getTournamentInfo();
    await this.getSessionData(gameSessionId, playerAddress);
  }

  componentWillReceiveProps = async (newProps) => {
    const { gameSessionId, playerAddress } = this.props
    const { gameSessionId: newGameSessionId,
      playerAddress: newPlayerAddress } = newProps

    if (gameSessionId !== newGameSessionId ||
      playerAddress !== newPlayerAddress) {
        await this.getSessionData(newGameSessionId, newPlayerAddress)
    }
  }

  getSessionData = async (gameSessionId, playerAddress) => {
    const { tournamentId } = this.props;
    if (!gameSessionId || !playerAddress) {
      return
    }
    const sessionData = await getGameSession(gameSessionId, playerAddress, tournamentId)
    console.log("Session Data", sessionData);
    this.setState({
      sessionData
    })
  }

  async saveGameSession() {

  }

  submitResult = async () => {
    const { tournamentId, recordFileHash, playerAddress,
      onToggle, gameSessionId, contractMethodSendWrapper } = this.props

    const result = await putGameReplay(gameSessionId, playerAddress, recordFileHash)
    console.log(result)

    try {
      contractMethodSendWrapper(
        "submitResult", // name
        [tournamentId, gameSessionId], //contract parameters
        { from: playerAddress }, // send parameters
        (txStatus, transaction) => { // callback
          console.log("submitResult callback: ", txStatus, transaction);
        })
      onToggle(true)
    } catch (err) {
      console.log('errrrrroooorrr');
    }
  }

  async getTournamentInfo() {
    const { drizzle, tournamentId } = this.props;
    const contract = drizzle.contracts.Tournaments;
    const maxTries = await contract.methods.getMaxTries(tournamentId).call()

    this.setState({
      tourneyMaxTries: maxTries
    })
  }

  formatTime = (time, isLeaderBoards) => {
    if (time) {
      const seconds = (parseInt(time) / 1000).toFixed(2);
      const minutes = Math.floor(parseInt(seconds) / 60);
      let totalTime = '';
      if (parseInt(seconds) > 60) {
        let sec = (parseInt(seconds) % 60).toFixed(2);
    
        totalTime += isLeaderBoards ? (minutes+":"+sec).toString() : (minutes+"min"+" "+sec+"sec").toString()
      } else {
        totalTime += isLeaderBoards ? ("0:"+seconds).toString() : (seconds+"sec").toString()
      }
      return totalTime
    }
  }

  render() {
    const { show, onToggle, didWin, gameSessionId, playerAddress, tournamentId } = this.props
    const { sessionData, tourneyMaxTries } = this.state

    const score = didWin ? (sessionData && sessionData.timeLeft) : 0;
    const highScore = (sessionData && sessionData.currentHighestNumber);
    const gameNo = (sessionData && sessionData.gameNo);

    console.log('Your current game no is', gameNo);
    console.log('Do you win?', didWin);
    console.log('Your score?', score);
    console.log('Your highScore?', highScore);
    
    let shouldSubmit = didWin || gameNo === tourneyMaxTries;
    let canTryAgain = gameNo < tourneyMaxTries;

    let scoreMsg = score === highScore ? `New high score!!` : ``;
    let finalScore = `Final score ${highScore}`

    return (
      <Modal show={show} toggleModal={onToggle}>
        <View style={{ margin: '20px', fontSize: '1.2rem', fontWeight: 'bold' }}>Game {gameNo} of {tourneyMaxTries}</View>
        <View style={{ margin: '20px', fontSize: '1.8rem' }}>{score && this.formatTime(score, false)}</View>
        {canTryAgain ? (
          <View style={{ margin: '20px', fontSize: '1.5rem' }}>{scoreMsg}</View>
        ) : (
            <View style={{ margin: '20px' }}>{finalScore}</View>
          )}
        {/* { (shouldSubmit) && ( */}
        {/* <View style={{ display: 'flex', flexDirection: 'row', width: '100%', margin: '0px auto 1rem auto' }}> */}
        <View style={{ margin: '20px', fontSize: '0.9rem' }}>High score is automatically submitted</View>
        {/* </View> */}
        {/* )} */}

        {((!didWin && canTryAgain) || canTryAgain) ? (
          <View style={{ display: 'flex', flexDirection: 'row', width: '100%', margin: '0px auto' }}>
            <Button
              onClick={async () => {
                navigateTo('/');
              }}>
              Try Again
                  </Button>
          </View>
        ) : (
            <View style={{ margin: '20px', fontSize: '1.5rem', fontWeight: 'bold' }}>Thanks For Playing!</View>
          )}
      </Modal>
    )
  }
}