import React, { Component } from 'react';
import { Modal, Card, Button, Flex, Box, Heading, Text, Loader } from "rimble-ui";
import styled from 'styled-components';

const StyledButton = styled(Button)`
  font-family: 'Apercu Light';
  font-size: 0.75rem;
  letter-spacing: 0.4px;
  text-transform: uppercase;
`

const StyledOutline = styled(Button.Outline)`
  font-family: 'Apercu Light';
  font-size: 0.75rem;
  letter-spacing: 0.4px;
  text-transform: uppercase;
`

class BuyInPromptModal extends Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false
    }
    this.handleConfirm = this.handleConfirm.bind(this);
  }

  confirmTransaction = async () => {
    this.setState({isLoading: true});
    const { drizzle, tournamentId, tournamentBuyInAmount,
      handleJoinClick, address, handleCloseBuyinModal } = this.props;
    const contract = drizzle.contracts.Tournaments;

    await contract.methods.payBuyIn(tournamentId, tournamentBuyInAmount).send({ from: address, value: tournamentBuyInAmount })
      .then( result => {
        if (result) {
          handleJoinClick();
          handleCloseBuyinModal();
          this.setState({ isLoading: false })
        }
      })
  }

  handleConfirm = e => {
    this.confirmTransaction();
  }

  render() {
    const { isOpen, handleCloseBuyinModal, maxTries } = this.props;
    const { isLoading } = this.state;

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

        <Box p={4} mt={3} mb={2}>
          <Heading.h3>Tournament Buy-in Confirmation</Heading.h3>
          <Text mb={3}>Before you join, you must accept the binding Metamask transaction.</Text>
          <Text>By confirming, your buy-in would be processed and you can play in the tournament up to {maxTries} times.</Text>
        </Box>

        <Flex
          px={4}
          py={3}
          justifyContent={"center"}
        >
          <StyledOutline onClick={handleCloseBuyinModal}>Cancel</StyledOutline>
          <StyledButton ml={3} onClick={this.handleConfirm} disabled={isLoading ? "disabled" : ""}>
            {isLoading ? <Loader color="white" size="1rem"/> : "Confirm Transaction"}
          </StyledButton>
        </Flex>
      </Card>
    </Modal>
    </>
    )
  }
}

export default BuyInPromptModal;