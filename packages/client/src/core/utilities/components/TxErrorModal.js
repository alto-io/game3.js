import React from "react";
import { Card, Button, Flex, Modal, Text, Heading } from "rimble-ui";

function TxErrorModal({ isOpen, toggleModal }) {
  return (
    <Modal isOpen={isOpen}>
      <Card maxWidth={"300px"}>
        <Flex flexDirection={"column"} justifyContent={"space-between"}>
          <Heading.h3>Transaction Error</Heading.h3>
          <Text my={3}>There was an error.</Text>
          <Button>Try again</Button>
          <Button.Outline onClick={toggleModal} width={[1]}>
            Close
          </Button.Outline>
        </Flex>
      </Card>
    </Modal>
  );
}

export default TxErrorModal;
