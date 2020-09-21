import React, { Component } from "react";
import { Button } from "rimble-ui";

interface IProps {
  handleConnectAccount?: any;
  rimbleInitialized: boolean;
}

class ConnectWalletButton extends Component<IProps> {
  render() {
    const { handleConnectAccount, rimbleInitialized } = this.props;

    return(
      <Button 
        onClick={handleConnectAccount}
        mr={3}
        size={"small"} 
        disabled={!rimbleInitialized ? "disabled" : ""}
      >
        Connect your wallet
      </Button>
    )
  }
}

export default ConnectWalletButton;