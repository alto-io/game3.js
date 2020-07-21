import React, { useState, useEffect } from "react";
import { Flex, Text } from "rimble-ui";
import EthToFiat from "./EthToFiat";

const TxFee = ({ txGasEstimate, calculateTxFee }) => {
  const [txFee, setTxFee] = useState(null);

  useEffect(() => {
    if (txGasEstimate) {
      setTxFee(calculateTxFee({ txGasEstimate }));
    }
  }, [txGasEstimate, setTxFee, calculateTxFee]);

  return (
    <Flex
      alignItems={"flex-end"}
      flexDirection={"column"}
      justifyContent={"center"}
    >
      {txFee ? (
        <>
          <Text color={"#444"} lineHeight={"1em"}>
            $<EthToFiat eth={txFee} />
          </Text>
          <Text color={"#615E66"} fontSize={"10px"}>
            {txFee} ETH
          </Text>
        </>
      ) : (
        <Text color={"#444"} fontSize={0}>
          Calculating fee
        </Text>
      )}
    </Flex>
  );
};

export default TxFee;
