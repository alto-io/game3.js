import React from "react";
import {
  Heading,
  Text,
  Modal,
  Link,
  MetaMaskButton
} from "rimble-ui";
import ModalCard from './ModalCard';
class NoWalletModal extends React.Component {
  renderContent = () => {
    return (
      <React.Fragment>
        <Heading.h2 my={3}>
          Install MetaMask to use the Rimble App Demo
        </Heading.h2>

        <Text my={4}>
          MetaMask is a browser extension that will let you use our
          blockchain features in this browser. It may take you a few minutes
          to set up your MetaMask account.
        </Text>

        <MetaMaskButton
          as={"a"}
          href="https://metamask.io"
          target="_blank"
          title="MetaMask website"
          mb={[5, 0]}
        >
          Install MetaMask
        </MetaMaskButton>

        <Text mt={"4"}>
          <Text.span bold>Rather use your phone?</Text.span> You can use the
          Rimble App Demo in mobile browser wallets like{" "}
          <Link
            href="https://status.im/"
            title="status.im website"
            target="_blank"
          >
            Status
          </Link>
          ,{" "}
          <Link
            href="https://www.cipherbrowser.com/"
            title="Cipher Wallet"
            target="_blank"
          >
            Cipher
          </Link>{" "}
          or{" "}
          <Link
            href="https://wallet.coinbase.com/"
            title="Coinbase Wallet"
            target="_blank"
          >
            Coinbase wallet
          </Link>
          .
        </Text>
      </React.Fragment>
    );
  }

  render() {
    return (
      <Modal isOpen={this.props.isOpen}>
        <ModalCard closeFunc={this.props.closeModal}>
          <ModalCard.Body>
            {this.renderContent()}
          </ModalCard.Body>
        </ModalCard>
      </Modal>
    );
  }
}

export default NoWalletModal;
