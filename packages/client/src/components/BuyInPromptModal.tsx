import React, { Component } from 'react';
import { Modal, Card, Button, Flex, Box, Heading, Text } from "rimble-ui";

class BuyInPromptModal extends Component {
  constructor(props) {
    super(props);
    this.handleConfirm = this.handleConfirm.bind(this);
  }

  confirmTransaction = async () => {
    const { drizzle, tournamentId, tournamentBalance, handleJoinClick } = this.props;

    const contract = drizzle.contracts.Tournaments;
    const buyIn = await contract.methods.payBuyIn(tournamentId, tournamentBalance).call();
    console.log(tournamentId);
    handleJoinClick();
  }

  handleConfirm = e => {
    this.confirmTransaction();
  }

  render() {
    const { isOpen, handleCloseBuyinModal } = this.props;

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
          <Button ml={3} onClick={this.handleConfirm}>Confirm Transaction</Button>
        </Flex>
      </Card>
    </Modal>
    )
  }
}

export default BuyInPromptModal;