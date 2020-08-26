import React, { Component } from "react";
import { Modal, Card, Button, Flex, Box, Heading, Text } from "rimble-ui";

import ConnectWalletButton from "./ConnectWalletButton";

class JoinPromptModal extends Component{
  handleConnectAccount = () => {
    this.props.connectAndValidateAccount( result => {
      if (result === "success") {
        // success
        console.log("Callback SUCCESS");
      } else if (result === "error") {
        // error
        console.log("Callback ERROR")
      }
    })

    this.props.handleCloseModal();
  }

  render() {
    return (
      <>
        <Modal isOpen={this.props.isOpen}>
          <Card width={"500px"} p={0}>
              <Button.Text
                icononly
                icon={"Close"}
                color={"moon-gray"}
                position={"absolute"}
                top={0}
                right={0}
                mt={3}
                mr={3}
                onClick={this.props.handleCloseModal}
              />

              <Box p={4}>
                <Heading.h3>No Wallet Connected</Heading.h3>
                <Text>You need to be logged in to join a tournament</Text>
              </Box>

              <Flex
                px={4}
                pb={4}
                justifyContent={"center"}
              >
                <ConnectWalletButton handleConnectAccount={this.handleConnectAccount} />
                
              </Flex>
            </Card>
        </Modal>
      </>
    )
  }

}

export default JoinPromptModal;