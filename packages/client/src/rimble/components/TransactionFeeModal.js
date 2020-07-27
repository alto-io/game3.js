import React from "react";
import { Heading, Text, Box, Flex, Icon } from "rimble-ui";

function TransactionFeeModal(props) {
  return (
    <Box>
      <Heading.h2>Transaction fees</Heading.h2>
      <Text my={3}>
        You need to pay a fee to use the Ethereum blockchain. This pays for
        someone to process your transaction and store the data.
      </Text>
      <Heading.h4>What are you paying for?</Heading.h4>
      <Flex flexWrap={"wrap"} justifyContent={"space-between"} mx={-2} my={3}>
        <Box width={[1, 1, 1 / 3]} px={2} my={3}>
          <Flex justifyContent={"center"}>
            <Icon color="primary" size="60" name="Fingerprint" />
          </Flex>
          <Heading.h4>Undeniable proof</Heading.h4>
          <Text>
            You get a public record of any funds you send or receive, a bit like
            a deed for a house.
          </Text>
        </Box>
        <Box width={[1, 1, 1 / 3]} px={2} my={3}>
          <Flex justifyContent={"center"}>
            <Icon color="primary" size="60" name="EnhancedEncryption" />
          </Flex>
          <Heading.h4>Unbreakable encryption</Heading.h4>
          <Text>Your funds can only ever go to your intended recipients.</Text>
        </Box>
        <Box width={[1, 1, 1 / 3]} px={2} my={3}>
          <Flex justifyContent={"center"}>
            <Icon color="primary" size="60" name="AccountBalance" />
            <Icon color="primary" size="60" name="NotInterested" />
          </Flex>
          <Heading.h4>Unparalleled control</Heading.h4>
          <Text>
            You can pay or get paid without using any banks or companies.
          </Text>
        </Box>
      </Flex>
    </Box>
  );
}

export default TransactionFeeModal;
