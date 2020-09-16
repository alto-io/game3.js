import React, { Component } from "react";
import { Button } from "rimble-ui";

interface IProps {
  handleConnectAccount?: any;
  rimbleInitialized: boolean;
}

class ConnectWalletButton extends Component<IProps> {
  render() {
    return(
      <Button 
        onClick={this.props.handleConnectAccount}
        mr={3}
        size={"small"} 
        disabled={this.props.rimbleInitialized ? "" : "disabled"}
      >
        Connect your wallet
      </Button>
    )
  }
}

export default ConnectWalletButton;