import React from "react";
import CounterCard from "./CounterCard";
import { drizzleConnect, DrizzleContext } from "@drizzle/react-plugin";

// Drizzle for state and contract interactions
import { addProgressAlert } from "./../core/redux/actions";

function CounterCardContainer({
  token,
  address,
  addProgressAlert,
  store,
  progressAlerts,
  callEstimateTxGas
}) {
  // ToDo: Can this be refactored and put someplace else more reusable?
  const preflightCheck = ({ token, drizzle, address, callback, event }) => {
    // Check that the wallet is connected
    // Check that there is a valid network
    // Check that the balance is high enough

    // Update UI to show started modal and include token details
    addProgressAlert({ token });

    const contract = drizzle.contracts[token.id];
    const tokenId = progressAlerts.allIds.length; // guess the length based on how many previous txs because drizzle doesn't return one
    callEstimateTxGas({ contract, address, tokenId: tokenId });

    // can call redux dispatch add action here that we have token details
    callback(event);

    return;
  };

  return (
    <DrizzleContext.Consumer>
      {({ drizzle, drizzleState }) => {
        return (
          <CounterCard
            drizzle={drizzle}
            drizzleState={drizzleState}
            address={address}
            token={token}
            preflightCheck={preflightCheck}
            enableBuyButton={true}
          />
        );
      }}
    </DrizzleContext.Consumer>
  );
}

/*
 * Export connected component.
 */
const mapStateToProps = state => {
  return {
    store: state,
    progressAlerts: state.progressAlerts
  };
};
const mapDispatchToProps = dispatch => {
  return {
    addProgressAlert: value => dispatch(addProgressAlert(value)),
    callEstimateTxGas: value =>
      dispatch({ type: "RIMBLE_CALL_ESTIMATE_TX_GAS", payload: { ...value } })
  };
};

export default drizzleConnect(
  CounterCardContainer,
  mapStateToProps,
  mapDispatchToProps
);