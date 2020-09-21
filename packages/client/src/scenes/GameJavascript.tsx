import React, { Component, createContext } from 'react';
import { updateSessionScore, updateGameNo, createSessionId, makeNewGameSession } from '../helpers/database';
import { navigateTo } from '../helpers/utilities'
import { Constants } from '@game3js/common';

export const GameJavascriptContext = createContext({});

export default class GameJavascript extends Component<any, any> {

  constructor(props) {
    super(props);

    this.state = {
      isPlayerDead: false,
      isGameRunning: true,
      sessionId: '0',
      playerAddress: '',
      tournamentId: '',
      gameName: Constants.TOSIOS
    }
    this.playerIsDead = this.playerIsDead.bind(this);
    this.gameIsRunning = this.gameIsRunning.bind(this);
    this.setSessionId = this.setSessionId.bind(this);
    this.initiateGame = this.initiateGame.bind(this);
    this.updateSessionHighScore = this.updateSessionHighScore.bind(this);
    this.endGame = this.endGame.bind(this);
  }

  async updateSessionHighScore() {
    const { isPlayerDead, sessionId, playerAddress, tournamentId } = this.state;
    const timeFinished = Date.now();
    let gamePayload = {}

    switch (this.state.gameName) {
      case Constants.TOSIOS:
        gamePayload = {
          timeFinished,
          didWin: !isPlayerDead
        }
        break;
      default:
        break;
    }

    let updatedData = await updateSessionScore(sessionId, playerAddress, tournamentId, gamePayload);
    console.log("Data updated with", updatedData);
    return updatedData;
  }

  async updateGameNumber(sessionId: any, playerAddress: any, tournamentId: any) {
    console.log("GAME JAVASCRIPT: UpdateGameNumber")
    await updateGameNo(sessionId, playerAddress, tournamentId);
  }

  playerIsDead(isDead) {
    console.log("GAME JAVASCRIPT: PlayerIsDead")
    this.setState({
      isPlayerDead: isDead
    })
  }

  gameIsRunning(isRunning) {
    console.log("GAME JAVASCRIPT: PlayerIsDead")
    this.setState({
      isGameRunning: isRunning
    })
  }

  async replaySaveToServer() {

  }

  async setSessionId(playerAddress, tournamentId) {
    console.log("GAME JAVASCRIPT: setSessionId")
    console.log("GAME JAVASCRIPT-setSessionId: Player_add", playerAddress)
    console.log("GAME JAVASCRIPT-setSessionId: tournamentId", tournamentId)
    let sessionId = await createSessionId(playerAddress, tournamentId);
    this.setState({
      sessionId
    })
  }

  async endGame(died: boolean) {
    const { stopRecording } = this.props;
    const { tournamentId } = this.state;
    
    this.gameIsRunning(false);
    this.playerIsDead(died);
    
    const data = await this.updateSessionHighScore();

    console.log("GAME JAVASCRIPT-endGame: Tourney ID", tournamentId)
    if (tournamentId || tournamentId === 0) {
      console.log("GAME JAVASCRIPT-endGame: New Highscore?", data.newHighScore);
      await stopRecording(data.newHighScore);
      console.log("GAME JAVASCRIPT-endGame: Recording stopped")
    }

    const gameEnded = new Event('gameend');
    dispatchEvent(gameEnded);
  }

  async initiateGame(params: any) {
    console.log("GAME JAVASCRIPT: Initiate Game")
    const { playerAddress, tournamentId, isDead, isGameRunning, players, endsAt } = params;
    const { startRecording } = this.props;

    this.setState({
      playerAddress,
      tournamentId
    })

    console.log("GAME JAVASCRIPT: Playeraddress", playerAddress)
    console.log("GAME JAVASCRIPT: Tourney ID", tournamentId)
    await this.setSessionId(playerAddress, tournamentId);
    console.log("GAME JAVASCRIPT: Session ID", this.state.sessionId)

    // gameName, sessionId, tournamentId, gamePayload
    let gamePayload = {
      timeLeft: Date.now(),
      players
    }

    await makeNewGameSession(Constants.TOSIOS, this.state.sessionId, tournamentId, gamePayload)
    await this.updateGameNumber(this.state.sessionId, playerAddress, tournamentId);
    this.gameIsRunning(isGameRunning);
    this.playerIsDead(isDead);

    if (tournamentId || tournamentId === 0) {
      startRecording.call()
      console.log("GAME JAVASCRIPT: Recording started...")
    }
  }

  render() {
    return (
      <GameJavascriptContext.Provider value={
        {
          ...this.state,
          updateSessionHighScore: this.updateSessionHighScore,
          updateGameNumber: this.updateGameNumber,
          playerIsDead: this.playerIsDead,
          gameIsRunning: this.gameIsRunning,
          initiateGame: this.initiateGame,
          endGame: this.endGame
        }
      }>
        {this.props.children}
      </GameJavascriptContext.Provider>
    )
  }
}