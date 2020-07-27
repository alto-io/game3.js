import React from "react";
import { Heading, Text, Flex, Button, Modal } from "rimble-ui";
import ModalCard from './ModalCard';

class UserRejectedValidationModal extends React.Component {
  sendMessageAgain = event => {
    this.props.closeModal();
    this.props.validateAccount();
  };

  renderContent = () => {
    return (
      <React.Fragment>
        <Heading.h2 my={3}>
          You can't continue without signing the message
        </Heading.h2>

        <Text my={4}>
          To use our blockchain features, sign the message to finish
          connecting.
        </Text>

        <Flex flexDirection={['column', 'row']} justifyContent={'flex-end'} mt={4}>
          <Button.Outline onClick={this.props.closeModal} mr={[0, 3]} mb={[3, 0]}>
            Cancel connection
          </Button.Outline>
          <Button onClick={this.sendMessageAgain}>
            Try again
          </Button>
        </Flex>
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

export default UserRejectedValidationModal;
