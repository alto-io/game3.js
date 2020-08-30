import React, {Component, createContext} from 'react';

export const GameJavascriptContext = createContext({});

export default class GameJavascript extends Component<any, any> {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <GameJavascriptContext.Provider value={{}}>
        {this.props.children}
      </GameJavascriptContext.Provider>
    )
  }
}