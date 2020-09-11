import React, { Component } from 'react';
import { Modal, Card, Button, Box, Heading, Text, Loader } from "rimble-ui";
import styled from 'styled-components';

const ResponsiveCard = styled(Card)`
  padding: 0;
  width: 90%;

  .btn-container {
    display: flex;
    justify-content: space-between;
    align-items: center; 
    flex-direction: column;
    margin: 1rem auto 2rem auto;

    button {
      width: 80%;
    }

    .btn-one {
      margin-bottom: 1rem;
    }
  }

  @media screen and (min-width: 768px) {
    width: 500px;

    .btn-container {
      width: 80%;
      justify-content: center;
      flex-direction: row;

      button {
        width: 50%;
      }

      .btn-one {
        margin-bottom: 0;
        margin-right: 2rem;
      }
    }
  }
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
        <ResponsiveCard>
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

        <Box p={4} mt={4}>
          <Heading.h3 mb={4}>Tournament Buy-in Confirmation</Heading.h3>
          <Text mb={3}>Before you join, you must accept the binding Metamask transaction.</Text>
          <Text>By confirming, your buy-in would be processed and you can play in the tournament up to {maxTries} times.</Text>
        </Box>

        <Box className="btn-container"
        >
          <Button.Outline onClick={handleCloseBuyinModal} className="btn-custom btn-one">Cancel</Button.Outline>
          <Button onClick={this.handleConfirm} className="btn-custom" disabled={isLoading ? "disabled" : ""}>
            {isLoading ? <Loader color="white" size="1rem"/> : "Confirm Transaction"}
          </Button>
        </Box>
      </ResponsiveCard>
    </Modal>
    </>
    )
  }
}

export default BuyInPromptModal;