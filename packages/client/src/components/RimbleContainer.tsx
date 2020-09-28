import React from "react";
import OutplayLoginHeader from "./OutplayLoginHeader";

import RimbleWeb3 from "../rimble/RimbleWeb3";

class RimbleContainer extends React.Component {
  render() {
    return (
      <RimbleWeb3.Consumer>
        {({
          contract,
          account,
          transactions,
          initContract,
          initAccount,
          contractMethodSendWrapper
        }) => (
              <OutplayLoginHeader
                contract={contract}
                account={account}
                transactions={transactions}
                initContract={initContract}
                contractMethodSendWrapper={contractMethodSendWrapper}
                drizzle={this.props.drizzle}
                drizzleState={this.props.drizzleState}
                accountBalance={this.props.accountBalance}
                accountBalanceLow={this.props.accountBalanceLow}
                accountValidated={this.props.accountValidated}
                connectAndValidateAccount={this.props.connectAndValidateAccount}
                onConnect={this.props.onConnect}
              />
        )}
      </RimbleWeb3.Consumer>
    );
  }
}



export default RimbleContainer;
