import React from "react";
import {
  Heading,
  Text,
  Icon,
  Modal,
  Flex,
  Box,
  Button,
  MetaMaskButton,
  Link
} from "rimble-ui";
import ModalCard from './ModalCard';
import TransactionFeeModal from "./TransactionFeeModal";
import GeneralUtil from "../GeneralUtil";

class TransactionConnectionModal extends React.Component {
  state = {
    showTxFees: false
  };

  toggleShowTxFees = e => {
    console.log("showTxFees", this.state.showTxFees);
    e.preventDefault();

    this.setState({
      showTxFees: !this.state.showTxFees
    });
  };

  renderContent = () => {
    return (
      <React.Fragment>
        {/* Start primary content */}
        <Box mb={3}>
          <Heading.h2>Connect to Rimble App Demo</Heading.h2>
          <Text my={3}>
            You need to connect your Ethereum account to use our
            blockchain features.
          </Text>
        </Box>

        <Flex
          flexWrap={"wrap"}
          justifyContent={"space-between"}
          mx={-2}
          mt={4}
          mb={4}
        >
          <Box width={[1, 1, 1 / 3]} px={2} my={3}>
            <Flex justifyContent={"center"}>
              <Icon color="primary" size="60" name="Public" />
            </Flex>
            <Heading.h5>The blockchain is public</Heading.h5>
            <Text fontSize="1">
              Your account activity is public on the blockchain.
              Choose an account you don’t mind being linked with your
              activity here.
            </Text>
          </Box>
          <Box width={[1, 1, 1 / 3]} px={2} my={3}>
            <Flex justifyContent={"center"}>
              <Icon
                color="primary"
                size="60"
                name="AccountBalanceWallet"
              />
            </Flex>
            <Heading.h5>Have some Ether for fees</Heading.h5>
            <Text fontSize="1">
              You’ll need Ether to pay transaction fees. Buy Ether
              from exchanges like Coinbase.
            </Text>
            <Link
              title="Learn about Ethereum transaction fees"
              as={"a"}
              href="#"
              onClick={this.toggleShowTxFees}
            >
              What are transaction fees?
            </Link>
          </Box>
          <Box width={[1, 1, 1 / 3]} px={2} my={3}>
            <Flex justifyContent={"center"}>
              <Icon color="primary" size="60" name="People" />
            </Flex>
            <Heading.h5>Have the right account ready</Heading.h5>
            <Text fontSize="1">
              If you have multiple Ethereum accounts, check that the
              one you want to use is active in your browser.
            </Text>
          </Box>
        </Flex>
        {/* End Modal Content */}
      </React.Fragment>
    );
  }

  renderConnectButton = () => {
    if (GeneralUtil.hasMetaMask()) {
      return (
        <MetaMaskButton
          onClick={this.props.validateAccount}
          width={[1, 1/2]}
          mb={[5, 0]}
        >
          Connect with MetaMask
        </MetaMaskButton>
      )
    } else {
      return (
        <Button
          onClick={this.props.validateAccount}
          width={[1, 'auto']}
        >
          Connect
        </Button>
      )
    }
  }

  render() {
    return (
      <Modal isOpen={this.props.isOpen}>
        <ModalCard closeFunc={this.props.closeModal}>

          {this.state.showTxFees === false ? (
            <React.Fragment>
              <ModalCard.Body>
                {this.renderContent()}
              </ModalCard.Body>
              <ModalCard.Footer>
                {this.renderConnectButton()}
              </ModalCard.Footer>
            </React.Fragment>
          ) : (
            <ModalCard.Body>
              <TransactionFeeModal />
              <ModalCard.BackButton onClick={this.toggleShowTxFees} />
            </ModalCard.Body>
          )}

        </ModalCard>
      </Modal>
    );
  }
}

export default TransactionConnectionModal;
