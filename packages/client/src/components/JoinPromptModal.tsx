import React, { Component } from "react";
import { Modal, Card, Button, Flex, Box, Heading, Text } from "rimble-ui";
import styled from 'styled-components';

import ConnectWalletButton from "./ConnectWalletButton";

const StyledCard = styled(Card)`
  width: 90%;

  @media screen and (min-width: 600px) {
    width: 400px;
  }
`

interface IProps {
  connectAndValidateAccount?: any;
  isOpen?: boolean;
  handleCloseModal?: any;
  modalText: string;
}

class JoinPromptModal extends Component<IProps>{
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
          <StyledCard p={0}>
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

              <Box px={4} pt={5} pb={4}>
                <Heading.h3>No Wallet Connected</Heading.h3>
                <Text>{this.props.modalText}</Text>
              </Box>

              <Flex
                px={4}
                pb={4}
                justifyContent={"center"}
              >
                <ConnectWalletButton handleConnectAccount={this.handleConnectAccount} />
                
              </Flex>
            </StyledCard>
        </Modal>
      </>
    )
  }

}

export default JoinPromptModal;