import React from "react";
import { Card, Button, Flex, Modal, Text, Heading } from "rimble-ui";

function WrongNetwork({ isOpen, toggleModal }) {
  return (
    <Modal isOpen={isOpen}>
      <Card maxWidth={"300px"}>
        <Flex flexDirection={"column"} justifyContent={"space-between"}>
          <Heading.h3>Switch to Rinkeby Network in MetaMask</Heading.h3>
          <Text my={3}>
            You can only buy Devcon V tickets on the Rinkeby network using Rinkeby ETH.
          </Text>
          <Button.Outline onClick={toggleModal} width={[1]}>
            Close
          </Button.Outline>
        </Flex>
      </Card>
    </Modal>
  );
}

export default WrongNetwork;
