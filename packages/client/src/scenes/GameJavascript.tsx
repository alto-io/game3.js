import React, {Component, createContext} from 'react';
import {updateSessionScore, updateGameNo, createSessionId, makeNewGameSession} from '../helpers/database';
import { navigateTo } from '../helpers/utilities'

export const GameJavascriptContext = createContext({});

export default class GameJavascript extends Component<any, any> {

  constructor(props) {
    super(props);

    this.state = {
      isPlayerDead: false,
      isGameRunning: true,
      sessionId: '0',
      playerAddress: '',
      tournamentId: ''
    }
    this.playerIsDead = this.playerIsDead.bind(this);
    this.gameIsRunning = this.gameIsRunning.bind(this);
    this.setSessionId = this.setSessionId.bind(this);
    this.initiateGame = this.initiateGame.bind(this);
    this.updateSessionHighScore = this.updateSessionHighScore.bind(this);
  }

  async updateSessionHighScore() {
    const { isPlayerDead, sessionId, playerAddress, tournamentId} = this.state;
    const timeFinished = Date.now();

    let updatedData = await updateSessionScore(!isPlayerDead, sessionId, playerAddress, tournamentId, timeFinished);
    console.log("Data updated with", updatedData);
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

  async setSessionId(playerAddress, tournamentId) {
    console.log("GAME JAVASCRIPT: setSessionId")
    console.log("GAME JAVASCRIPT-setSessionId: Player_add", playerAddress)
    console.log("GAME JAVASCRIPT-setSessionId: tournamentId", tournamentId)
    let sessionId = await createSessionId(playerAddress, tournamentId);
    this.setState({
      sessionId
    })
  }

  async initiateGame(params: any) {
    console.log("GAME JAVASCRIPT: Initiate Game")
    const { playerAddress, tournamentId, isDead, isGameRunning, players, endsAt} = params;
    
    this.setState({
      playerAddress,
      tournamentId
    })

    console.log("GAME JAVASCRIPT: Playeraddress", playerAddress)
    console.log("GAME JAVASCRIPT: Tourney ID", tournamentId)
    await this.setSessionId(playerAddress, tournamentId);
    console.log("GAME JAVASCRIPT: Session ID", this.state.sessionId)
    await makeNewGameSession(this.state.sessionId, tournamentId, players, endsAt)
    await this.updateGameNumber(this.state.sessionId, playerAddress, tournamentId);
    this.gameIsRunning(isGameRunning);
    this.playerIsDead(isDead);
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
          initiateGame: this.initiateGame
        }
      }>
        {this.props.children}
      </GameJavascriptContext.Provider>
    )
  }
}