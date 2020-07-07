import React, { Component, Fragment } from 'react';
import { RouteComponentProps } from '@reach/router';

interface IProps extends RouteComponentProps {
    propVar: any;
  }
  
  interface IState {
    stateVar: any;
  }

  const INITIAL_STATE: IState = {
    stateVar: { value: "someValue"},
  };
  
// external functions
function functionExample(someVar) {
    
}

export default class SceneTemplate extends Component<IProps, IState> {
    
    public state: IState = {
        stateVar: null,
      };


    constructor(props: any) {
        super(props);
        this.state = {
            ...INITIAL_STATE
        };
    }
          
    // BASE
    componentDidMount() {
    }

    // HANDLERS
    // handleFunction = (event: any) => {

    // }

    // METHODS
    // updateSomething = () => {

    // }

    // RENDER
    render() {
        return (
            <Fragment>
                Howdy
            </Fragment>

        );
    }
}