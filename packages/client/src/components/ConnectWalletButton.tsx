import React, { Component } from "react";
import { Button } from "rimble-ui";

class ConnectWalletButton extends Component {
  render() {
    return(
      <Button 
        onClick={this.props.handleConnectAccount}
        mr={3}
        size={"small"} 
      >
        Connect your wallet
      </Button>
    )
  }
}

export default ConnectWalletButton;