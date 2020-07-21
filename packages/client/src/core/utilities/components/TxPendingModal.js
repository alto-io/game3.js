import React, { useState, useRef, useEffect } from "react";
import {
  Modal,
  Box,
  Icon,
  Link,
  Button,
  Flex,
  Heading,
  Text,
  Card,
  Tooltip
} from "rimble-ui";
import ProgressBar from "./ProgressBar";
import ProgressPercentCircle from "./ProgressPercentCircle";
import EyeIcon from "./EyeIcon";
import shortenAddress from "./../shortenAddress";
import EthToFiat from "./EthToFiat";
import TxFee from "./TxFee";

function TxPendingModal({
  isOpen,
  toggleModal,
  address,
  transaction,
  getPercentComplete,
  getTimeToCompletionString,
  calculateTxFee
}) {
  const [progress, setProgress] = useState(null); // percent of estimated time elapsed
  const [estimatedCompletionTime, setEstimatedCompletionTime] = useState(null); // string of time remaining
  const [delay] = useState(1000); // set "tick" time for timer

  const { status, completed } = transaction;
  const { startTime, timeEstimate } = transaction.remainingTime;

  // Calls functions to update time and percent values
  useInterval(
    () => {
      const percentComplete = getPercentComplete({ startTime, timeEstimate });
      setProgress(percentComplete);

      const timeString = getTimeToCompletionString({ startTime, timeEstimate });
      setEstimatedCompletionTime(timeString);
    },
    !completed && progress < 100 && status === "pending" ? delay : null // Stop timer when conditions aren't true
  );

  return (
    <Modal width={"auto"} m={3} minWidth={"300px"} isOpen={isOpen}>
      <Card borderRadius={1} maxWidth={"436px"}>
        <Flex
          alignItems={"center"}
          justifyContent={"space-between"}
          flexDirection={"column"}
        >
          <Heading.h3 mb={3}>Sending your ticket...</Heading.h3>
          <Text>
            Nice one! Your ticket should be with your account shortly.
          </Text>

          <Flex
            alignItems={"stretch"}
            flexDirection={"column"}
            borderRadius={2}
            borderColor={"#ccc"}
            borderWidth={1}
            borderStyle={"solid"}
            overflow={"hidden"}
            my={4}
            width={[1]}
          >
            <Box>
              <Box bg={"primary"}>
                <ProgressBar percent={progress} height={"10px"} />
                <Box px={3} py={2}>
                  <Flex alignItems={"center"}>
                    <ProgressPercentCircle percent={progress} mr={3} />
                    <Text color={"white"} ml={3}>
                      In progress
                    </Text>
                  </Flex>
                </Box>
              </Box>
            </Box>

            <Flex justifyContent={"space-between"} bg={"#E8E8E8"} p={3}>
              <Text fontSize={1} color={"#444"} fontWeight={600}>
                Your account
              </Text>
              <Link
                fontWeight={"normal"}
                href={"https://rinkeby.etherscan.io/address/" + address}
                target={"_blank"}
                color={"primary"}
                hoverColor={"primary"}
              >
                <Flex alignItems={"center"}>
                  <Text fontSize={1} fontWeight={600} color={"primary"}>
                    {shortenAddress(address)}
                  </Text>
                  <EyeIcon />
                </Flex>
              </Link>
            </Flex>

            <Flex
              justifyContent={"space-between"}
              bg={"#EEE"}
              py={2}
              px={3}
              alignItems={"center"}
            >
              <Text fontSize={1} color={"#444"} fontWeight={600}>
                Price
              </Text>
              <Flex alignItems={"flex-end"} flexDirection={"column"}>
                <Text color={"#444"} lineHeight={"1em"}>
                  {transaction.content.token.ethPrice} ETH
                </Text>
                <Text color={"#615E66"} fontSize={"10px"}>
                  $<EthToFiat eth={transaction.content.token.ethPrice} /> USD
                </Text>
              </Flex>
            </Flex>

            <Flex
              justifyContent={"space-between"}
              bg={"#E8E8E8"}
              py={2}
              px={3}
              alignItems={"center"}
            >
              <Flex alignItems={"center"}>
                <Text fontSize={1} color={"#444"} fontWeight={600}>
                  Transaction fee
                </Text>
                <Link href="#" ml={1}>
                  <Tooltip
                    message="Pays the Ethereum network to process your transaction. Spent even if the transaction fails."
                    position="top"
                  >
                    <Icon name={"InfoOutline"} size={"14px"} />
                  </Tooltip>
                </Link>
              </Flex>
              <TxFee
                calculateTxFee={calculateTxFee}
                txGasEstimate={transaction.txFee.txGasEstimate}
              />
            </Flex>

            <Flex
              justifyContent={"space-between"}
              bg={"#EEE"}
              p={3}
              alignItems={"center"}
            >
              <Text fontSize={1} color={"#444"} fontWeight={600}>
                Estimated Wait
              </Text>
              <Text fontSize={1} color={"#444"} ml={3}>
                {estimatedCompletionTime
                  ? estimatedCompletionTime
                  : "Less than 2 minutes"}
              </Text>
            </Flex>
          </Flex>

          <Button.Outline
            onClick={() => {
              toggleModal(isOpen);
            }}
            width={[1]}
          >
            Close
          </Button.Outline>
        </Flex>
      </Card>
    </Modal>
  );
}

// Duplicated in TxActivityModal so that each component can manage progress
function useInterval(callback, delay) {
  const savedCallback = useRef();

  // Remember the latest function.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

export default TxPendingModal;
