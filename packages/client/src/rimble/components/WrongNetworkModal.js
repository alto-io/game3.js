import React from "react";
import {
  Heading,
  Text,
  Flex,
  Modal,
  Button,
  Box,
  Loader
} from "rimble-ui";
import ModalCard from './ModalCard';
import GeneralUtil from "../GeneralUtil";
import RimbleUtils from "@rimble/utils";

class WrongNetworkModal extends React.Component {
  renderContent = () => {
    return (
      <React.Fragment>
        <Heading.h2 my={3}>
          Switch to the {this.props.network.required.name} network in{" "}
          {GeneralUtil.hasMetaMask() ? `MetaMask` : `Settings`}
        </Heading.h2>

        <Text my={4}>
          The Rimble Demo App only works on the{" "}
          <Text.span style={{ textTransform: "capitalize" }}>
            {this.props.network.required.name}
          </Text.span>{" "}
          network. You’re currently on the{" "}
          <Text.span style={{ textTransform: "capitalize" }}>
            {" "}
            {this.props.network.current.name}
          </Text.span>{" "}
          network.
        </Text>

        {GeneralUtil.hasMetaMask() && !RimbleUtils.isMobileDevice() ? (
          <Box bg={"#f6f6fc"} p={3} display={["none", "block"]}>
            <Flex alignItems={"center"}>
              <Box position={"relative"} width={"4em"}>
                <Box>
                  <Loader size={"3em"} />
                </Box>
              </Box>
              <Box>
                <Text fontWeight={4}>Waiting for the right network...</Text>
                <Text fontWeight={2}>
                  Go to your MetaMask extension to switch
                </Text>
              </Box>
            </Flex>
          </Box>
        ) : null}

        <Box display={["block", "none"]}>
          <Button onClick={this.props.closeModal} width={1}>
            OK
          </Button>
        </Box>
      </React.Fragment>
    )
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

export default WrongNetworkModal;
