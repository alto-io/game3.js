import React, { Component } from 'react';
import { RouteComponentProps, createHistory, createMemorySource} from '@reach/router';

interface IProps extends RouteComponentProps {
	when?: boolean; // This is like the "when" prop of react-router's Prompt component
}

interface IState {
	alertMessage: string,
}

export default class LeavingGamePrompt extends Component<IProps, IState> {

	private alertMessage: string // The message is not shown by the IE for security reasons
	private myHistory: any;

	public state = {
		alertMessage: "Are you sure you want to leave this page? Your progress will be lost."
	}

	constructor(props) {
		super(props);

		let source = createMemorySource('/')
		this.myHistory = createHistory(source);
	}

	componentDidMount() {
		window.addEventListener("beforeunload", this.eventDispatcher);

	    window.history.pushState(null, document.title, window.location.href);
	    window.addEventListener('popstate', this.eventDispatcher);
	}

	componentWillUnmount() {
		window.removeEventListener("beforeunload", this.eventDispatcher);
		window.removeEventListener('popstate', this.eventDispatcher);
	}

  	eventDispatcher = (e: any) => {
  		console.log(this.myHistory);
  		console.log("Test eventDispatcher");
  		const { alertMessage } = this.state;
  		
  		if (this.props.when) {
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
  		  		default:
  		  			break;
  		  	}
  		}
  	}

  	render() {
  		return null;
  	} 
}