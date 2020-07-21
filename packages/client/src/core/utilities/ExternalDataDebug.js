import React from "react";
import { Box, Button, Heading } from "rimble-ui";
import { drizzleConnect } from "@drizzle/react-plugin";
import EthToFiat from "./components/EthToFiat";
import { DrizzleContext } from "@drizzle/react-plugin";

const ExternalDataDebug = ({
  fetchEthPrice,
  callTxGasPrice,
  fetchGasStationRecentTx,
  externalData
}) => {
  console.log("externalData:", externalData);

  const handleFetchEthPrice = () => {
    // call saga?
    fetchEthPrice("usd");
  };

  const handleCallTxGasPrice = ({ web3 }) => {
    callTxGasPrice({
      // txHash:
      //   "0x5d4e46d10d09d85ce7994712196fbccd03b0feaacf56e14c5e0b7e67f0c4747e", // 1 GWEI
      txHash:
        "0x49e3825b4a2e8644dcddbde6cb4324b3b87f5cd9f58335ef23cb2ac9107f5489",
      web3: web3
    });
  };

  const handleFetchGasStationRecentTx = () => {
    fetchGasStationRecentTx();
  };
  return (
    <DrizzleContext.Consumer>
      {({ drizzle }) => {
        return (
          <Box m={3}>
            <Heading as={"h4"}>Progress Alert Debug</Heading>
            <Box
              p={3}
              borderColor={"gray"}
              borderWidth={1}
              borderRadius={3}
              borderStyle={"solid"}
            >
              <Box>
                <Button onClick={handleFetchEthPrice}>fetchEthPrice</Button>
                <EthToFiat eth={1} />
              </Box>
              <Box>
                <Button
                  onClick={() => {
                    handleCallTxGasPrice({ web3: drizzle.web3 });
                  }}
                >
                  callTxGasPrice
                </Button>
                <pre>{JSON.stringify(externalData.txGas, null, 2)}</pre>
              </Box>
              <Box>
                <Button
                  onClick={() => {
                    handleFetchGasStationRecentTx();
                  }}
                >
                  fetchGasStationRecentTx
                </Button>
                <pre>{JSON.stringify(externalData.txEstimate, null, 2)}</pre>
              </Box>
            </Box>
          </Box>
        );
      }}
    </DrizzleContext.Consumer>
  );
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
      dispatch({ type: "RIMBLE_FETCH_ETH_PRICE", payload: { value } }),
    callTxGasPrice: value =>
      dispatch({ type: "RIMBLE_CALL_TX_GAS_PRICE", payload: { ...value } }),
    fetchGasStationRecentTx: value =>
      dispatch({
        type: "RIMBLE_FETCH_GAS_STATION_RECENT_TX",
        payload: { value }
      })
  };
};

export default drizzleConnect(
  ExternalDataDebug,
  mapStateToProps,
  mapDispatchToProps
);
