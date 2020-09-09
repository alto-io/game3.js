import * as React from 'react';
import styled from 'styled-components';

import { RouteComponentProps } from '@reach/router'

import Modal from './Modal';
import { Button } from '../components';
import GameJavascript, { GameJavascriptContext } from '../scenes/GameJavascript';
import { navigateTo } from '../helpers/utilities';

import {
  updateGameNo,
  getGameNo,
  getGameSession,
  putGameReplay,
  updateSessionScore
} from '../helpers/database'

const StyledContainer = styled.div`
  margin-top: 1.25rem;
  padding: 0;

  h6 {
    font-weight: bold;
    font-size: 1.25rem;
    letter-spacing: 0.15px;
    margin: 1.5rem 0;
    text-align: center;
  }

  .score {
    font-family: 'Apercu Bold';
    font-size: 1.8rem;
    letter-spacing: 0.25px;
    margin-bottom: 1.25rem;
  }

  .score-msg {
    font-size: 1.6rem;
    margin-bottom: 1.25rem;
  }

  .thanks-msg {
    font-size: 1.4rem;
    font-weight: bold;
    margin-top: 1.5rem
  } 

  .highscore-submitted {
    font-size: 0.825rem;
    letter-spacing: 0.1px;
    margin-bottom: 1.25rem;
  }

  .btn-container {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: row;
    width: 100%;
    margin-top: 1.5rem;
  }
`

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
        <StyledContainer>
          <h6>Game {gameNo} of {tourneyMaxTries}</h6>
          {canTryAgain ? (
            <p className="score">{score && this.formatTime(score, false)}</p>
          ) : (
            <p className="score-msg">{scoreMsg}</p>
          )} 

          <p className="highscore-submitted">High score is automatically submitted</p>

          {( (!didWin && canTryAgain) || canTryAgain ) ? (
            <div className="btn-container">
              <Button onClick={ async () => {
                  navigateTo('/');
              }}>Try Again</Button>
            </div>
          ) : (
            <p className="thanks-msg">Thanks for Playing!</p>
          )}
        </StyledContainer>
      </Modal>
    )
  }
}