import React, {Component, createContext} from 'react';
import {updateSessionScore} from '../helpers/database';

export const GameJavascriptContext = createContext({});

export default class GameJavascript extends Component<any, any> {

  constructor(props) {
    super(props);
  }

  async updateSessionHighScore(score: number, sessionId: any, playerAddress: any) {
    await updateSessionScore(score, sessionId, playerAddress);
  }

  render() {
    return (
      <GameJavascriptContext.Provider value={{}}>
        {this.props.children}
      </GameJavascriptContext.Provider>
    )
  }
}