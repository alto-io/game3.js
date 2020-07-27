import React, { Component } from 'react';
import { Card, Text, Button } from 'rimble-ui';

import AccountOverview from "../rimble/components/AccountOverview";


class WalletBlock extends Component {

  handleConnectAccount = () => {
    this.props.connectAndValidateAccount(result => {
      if (result === "success") {
        // success
        console.log("Callback SUCCESS");
      } else if (result === "error") {
        // error
        console.log("Callback ERROR");
      }
    })
  }

  renderContent = () => {
    if (this.props.account && this.props.accountValidated) {
      return (
        <AccountOverview
          account={this.props.account}
          accountBalanceLow={this.props.accountBalanceLow}
          accountBalance={this.props.accountBalance}
        />
      )
    } else {
      return (
        <Button onClick={this.handleConnectAccount} width={1}>
          Connect your wallet
        </Button>
      )
    }
  }

  render() {
    return (
      <Card maxWidth={'640px'} mx={'auto'} p={4} >
        <Text fontWeight={3} mb={3}>
          Wallet:
        </Text>
        {this.renderContent()}
      </Card>
    );
  }

}

export default WalletBlock;
