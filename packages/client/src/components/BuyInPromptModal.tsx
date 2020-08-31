import React, { Component } from 'react';
import { Modal, Card, Button, Flex, Box, Heading, Text } from "rimble-ui";

class BuyInPromptModal extends Component {
  render() {
    const { isOpen, handleCloseBuyinModal, handleJoinClick } = this.props;

    return(
      <Modal isOpen={isOpen}>
      <Card width={"420px"} p={0}>
        <Button.Text
          icononly
          icon={"Close"}
          color={"moon-gray"}
          position={"absolute"}
          top={0}
          right={0}
          mt={3}
          mr={3}
          onClick={handleCloseBuyinModal}
        />

        <Box p={4} mt={4} mb={2}>
          <Heading.h3>Tournament Buy-in Confirmation</Heading.h3>
          <Text mb={3}>Before you join, you must accept the binding Metamask transaction.</Text>
          <Text>By confirming, your buy-in would be processed and you can play in the tournament up to three times.</Text>
        </Box>

        <Flex
          px={4}
          py={3}
          justifyContent={"center"}
        >
          <Button.Outline onClick={handleCloseBuyinModal}>Cancel</Button.Outline>
          <Button ml={3}>Confirm Transaction</Button>
        </Flex>
      </Card>
    </Modal>
    )
  }
}

export default BuyInPromptModal;