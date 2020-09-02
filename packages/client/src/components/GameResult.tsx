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
    const { gameSessionId, playerAddress, tournamentId } = this.props;
    await this.getTournamentInfo();
    await this.updateTriesUsed(gameSessionId, playerAddress); // Decerease user's remaining tries by 1
    await this.getSessionData(gameSessionId, playerAddress);
    await updateSessionScore(gameSessionId, playerAddress, tournamentId); // automatically updates highest score
  }

  componentWillReceiveProps = (newProps) => {
    const { gameSessionId, playerAddress } = this.props
    const { gameSessionId: newGameSessionId,
      playerAddress: newPlayerAddress } = newProps

    if (gameSessionId !== newGameSessionId ||
      playerAddress !== newPlayerAddress) {
      this.getSessionData(newGameSessionId, newPlayerAddress)
    }
  }

  async updateTriesUsed(gameSessionId, playerAddress) {
    const { tourneyMaxTries } = this.state;
    const { tournamentId } = this.props;

    const currentGameNo = await getGameNo(gameSessionId, playerAddress, tournamentId);
    console.log("GAME NUMBEEER", currentGameNo);

    if (currentGameNo < tourneyMaxTries) {
      await updateGameNo(gameSessionId, playerAddress, tournamentId)
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

  render() {
    const { show, onToggle, didWin, gameSessionId, playerAddress, tournamentId } = this.props
    const { sessionData, tourneyMaxTries } = this.state

    const score = (sessionData && sessionData.timeLeft);
    const highScore = (sessionData && sessionData.currentHighestNumber);
    const gameNo = (sessionData && sessionData.gameNo);

    console.log('Your current game no is', gameNo);

    return (
      <GameJavascript>
        <GameJavascriptContext.Consumer>{context => {

          let shouldSubmit = didWin || gameNo === tourneyMaxTries;
          let canTryAgain = gameNo < tourneyMaxTries;

          return (
            <Modal show={show} toggleModal={onToggle}>
              <View style={{ margin: '20px', fontSize: '1.2rem', fontWeight: 'bold' }}>Game {gameNo} of {tourneyMaxTries}</View>
              <View style={{ margin: '20px' }}>Score: {score}</View>
              <View style={{ margin: '20px' }}>High Score: {highScore}</View>
              {/* { (shouldSubmit) && ( */}
              {/* <View style={{ display: 'flex', flexDirection: 'row', width: '100%', margin: '0px auto 1rem auto' }}> */}
              <View style={{ margin: '20px', fontSize: '0.9rem' }}>High score automatically submitted</View>
              {/* </View> */}
              {/* )} */}

              {(!didWin || canTryAgain) ? (
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
        }}
        </GameJavascriptContext.Consumer>
      </GameJavascript>
    )
  }
}