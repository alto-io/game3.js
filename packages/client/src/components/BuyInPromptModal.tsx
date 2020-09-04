import React, { Component } from 'react';
import { Modal, Card, Button, Flex, Box, Heading, Text } from "rimble-ui";
import drizzleConfig from '../drizzleConfig';

class BuyInPromptModal extends Component<any, any> {
  constructor(props) {
    super(props);
    this.handleConfirm = this.handleConfirm.bind(this);
  }

  confirmTransaction = async () => {
    const { drizzle, tournamentId, tournamentBuyInAmount,
      handleJoinClick, address, maxTries } = this.props;
    const contract = drizzle.contracts.Tournaments;

    await contract.methods.payBuyIn(tournamentId, tournamentBuyInAmount).send({ from: address, value: tournamentBuyInAmount })
      .then( result => {
        if (result) {
          handleJoinClick();
        }
      })
  }

  handleConfirm = e => {
    this.confirmTransaction();
  }

  render() {
    const { isOpen, handleCloseBuyinModal, maxTries } = this.props;

    return(
      <>
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
          <Text>By confirming, your buy-in would be processed and you can play in the tournament up to {maxTries} times.</Text>
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
    </>
    )
  }
}

export default BuyInPromptModal;