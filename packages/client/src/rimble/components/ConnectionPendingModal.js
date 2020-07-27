import React from "react";
import {
  Heading,
  Text,
  Modal,
  Flex,
  Box,
  Loader
} from "rimble-ui";
import ModalCard from './ModalCard';
import GeneralUtil from "../GeneralUtil";

class ConnectionPendingModal extends React.Component {
  renderContent = () => {
    return (
      <React.Fragment>
        <Heading.h2 my={3}>Connect Ethereum account</Heading.h2>

        <Text my={4}>
          Confirm the request that's just appeared. If you can't see a
          request, open your{" "}
          {GeneralUtil.hasMetaMask()
            ? `MetaMask extension`
            : `dApp browser settings`}
          .
        </Text>

        <Box bg={"#f6f6fc"} p={3} display={["none", "block"]}>
          <Flex alignItems={"center"}>
            <Box position={"relative"} width={"4em"}>
              <Box>
                <Loader size={"3em"} />
              </Box>
            </Box>
            <Box>
              <Text fontWeight={4}>
                Waiting for connection confirmation...
              </Text>
              <Text fontWeight={2}>This won’t cost you any Ether</Text>
            </Box>
          </Flex>
        </Box>
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

export default ConnectionPendingModal;
