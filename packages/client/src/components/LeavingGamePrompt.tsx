import React, { Component } from 'react';
import { RouteComponentProps } from '@reach/router';

interface IProps extends RouteComponentProps {
	when?: boolean; // This is like the "when" prop of react-router's Prompt component
}

interface IState {
	alertMessage: string,
}

export default class LeavingGamePrompt extends Component<IProps, IState> {

	public state = {
		// The message is not shown by the IE for security reasons
		alertMessage: "Are you sure you want to leave this page? Your progress will be lost." 
	}

	constructor(props = null) {
		super(props);
	}

	componentDidMount() {
    console.log("Mounted");
		window.history.pushState(null, document.title, window.location.href);

	  // window.addEventListener('popstate', this.eventDispatcher);
		window.addEventListener("beforeunload", this.eventDispatcher);
		window.addEventListener("onpathchange", this.eventDispatcher);
	}

	componentWillUnmount() {
    console.log("Dismounted");
		window.removeEventListener("onpathchange", this.eventDispatcher);
		window.removeEventListener("beforeunload", this.eventDispatcher);
		// window.removeEventListener('popstate', this.eventDispatcher);
	}


	handleEvents(e: any) {
		const { alertMessage } = this.state;
		switch(e.type) {
  		  	case "beforeunload": 
  		  		console.log("Test beforeunload");
      
            (e || window.event).returnValue = alertMessage;
            return alertMessage;
  		  		break;
  		  	case "popstate": 
  		  		console.log("Test popstate");
    
            if(window.confirm(alertMessage)) {
              window.history.back();
            } else {
              window.history.pushState(null, document.title, window.location.href);  
            }
  		  		break;
  		  	case "onpathchange":
  		  		console.log("Test onpathchange");
            
            if(!window.confirm(alertMessage) && (typeof e.cancelable !== 'boolean' || e.cancelable)) {
              // console.log("Will be prevented", e.cancelable);
              e.preventDefault();
            } else {
              // console.log("Will be not prevented?", e.cancelable);
              e.detail.continue();
            }
  		  		break;
  		  	default:
  		  		break;
  		  }
	}

  eventDispatcher = (e: any) => {
  	console.log("Test eventDispatcher");
  	const { when } = this.props;
  		
  	if (when === undefined) {
  		this.handleEvents(e);
  	} else {
  		if (when) {
  			this.handleEvents(e);
  		}
  	}
  }

  // Render null
  render() {
  	return null;
  } 
}