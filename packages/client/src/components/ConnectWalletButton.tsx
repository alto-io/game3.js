import React, { Component } from "react";
import { Button } from "rimble-ui";
import styled from "styled-components";

const StyledButton = styled(Button)`
  font-family: 'Apercu Light';
  font-size: 0.75rem;
  letter-spacing: 0.4px;
  text-transform: uppercase;
`

class ConnectWalletButton extends Component {
  render() {
    return(
      <StyledButton 
        color="primary" 
        size="small"
        onClick={this.props.handleConnectAccount}
        mr={3} 
      >
        Connect your wallet
      </StyledButton>
    )
  }
}

export default ConnectWalletButton;