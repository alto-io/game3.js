import React, { useState, useEffect } from "react";
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
import EyeIcon from "./EyeIcon";
import MetaMaskLoader from "./MetaMaskLoader";
import shortenAddress from "./../shortenAddress";
import EthToFiat from "./EthToFiat";
import TxFee from "./TxFee";

const TxStartModal = ({
  isOpen,
  toggleModal,
  address,
  transaction,
  externalData,
  calculateTxFee,
  getTimeToCompletionString
}) => {
  const [estimatedCompletionTime, setEstimatedCompletionTime] = useState(null); // string of time remaining

  useEffect(() => {
    if (externalData.gasStationInfo) {
      const timeString = getTimeToCompletionString({
        startTime: Date.now(),
        timeEstimate: externalData.gasStationInfo.avgTxWait * 1000 // convert to ms
      });
      setEstimatedCompletionTime(timeString);
    }
  }, [externalData, getTimeToCompletionString, setEstimatedCompletionTime]);

  return (
    <Modal width={"auto"} m={3} minWidth={"300px"} isOpen={isOpen}>
      <Card borderRadius={1} maxWidth={"436px"}>
        <Flex
          alignItems={"center"}
          justifyContent={"space-between"}
          flexDirection={"column"}
        >
          <Heading.h3 mb={3}>Confirm your purchase in MetaMask</Heading.h3>
          <Text>
            Double check the details here &ndash; this transaction can't be
            refunded.
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
            <Box bg={"primary"} px={3} py={2}>
              <Text color={"white"}>{transaction.content.token.name}</Text>
            </Box>

            <Flex p={3} borderBottom={"1px solid #ccc"} alignItems={"center"}>
              <MetaMaskLoader />
              <Box>
                <Text fontWeight={"600"} fontSize={1} lineHeight={"1.25em"}>
                  Waiting for confirmation...
                </Text>
                <Text
                  fontSize={1}
                  fontWeight={100}
                  lineHeight={"1.25em"}
                  color={"primary"}
                >
                  Don't see the MetaMask popup?
                </Text>
              </Box>
            </Flex>

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
                <Link href ml={1}>
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
              <Text fontSize={1} color={"#444"}>
                {estimatedCompletionTime
                  ? estimatedCompletionTime
                  : "Less than 2 minutes"}
              </Text>
            </Flex>
          </Flex>

          <Button.Outline
            onClick={() => {
              toggleModal(isOpen); // Cancel the tx via the web3 api
            }}
            width={[1]}
          >
            Cancel purchase
          </Button.Outline>
        </Flex>
      </Card>
    </Modal>
  );
};

export default TxStartModal;
