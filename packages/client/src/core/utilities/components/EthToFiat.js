import React from "react";
import { drizzleConnect } from "@drizzle/react-plugin";

const EthToFiat = ({ eth, externalData, fetchEthPrice }) => {
  const getFiatValue = eth => {
    if (Object.keys(externalData.ethPrice).length === 0) {
      fetchEthPrice("usd");
      return "can't convert";
    } else {
      const fiat = eth * externalData.ethPrice.ask;
      return parseFloat(Math.round(fiat * 100) / 100).toFixed(2);
    }
  };

  return <>{getFiatValue(eth)}</>;
};

/*
 * Export connected component.
 */
const mapStateToProps = state => {
  return {
    externalData: state.externalData
  };
};
const mapDispatchToProps = dispatch => {
  return {
    fetchEthPrice: value =>
      dispatch({ type: "RIMBLE_FETCH_ETH_PRICE", payload: { value } })
  };
};

export default drizzleConnect(EthToFiat, mapStateToProps, mapDispatchToProps);
