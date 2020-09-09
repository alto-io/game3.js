import React, { Component } from 'react';
import { Box, Flex, Modal, Button, Text, Card } from 'rimble-ui';
import styled from 'styled-components';

import TournamentResultsCard from './TournamentResultsCard';

const StyledButton = styled(Button)`
  font-family: 'Apercu Light';
  font-size: 0.75rem;
  letter-spacing: 0.4px;
  text-transform: uppercase;
`
class ViewResultsModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false
    }
  }

  closeModal = e => {
    e.preventDefault();
    this.setState({ isOpen: false});
  };

  openModal = e => {
    e.preventDefault();
    this.setState({ isOpen: true});
  };

  render() {
    const { tournamentId, playerAddress, drizzle, setRoute } = this.props;
    
    return (
      <>
        <Box>
          <StyledButton onClick={this.openModal}>View Results</StyledButton>

          <Modal isOpen={this.state.isOpen}>
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
                onClick={this.closeModal}
              />

              <Box p={4} mt={3}>
                <TournamentResultsCard 
                  tournamentId={tournamentId}
                  playerAddress={playerAddress}
                  drizzle={drizzle}
                  setRoute={setRoute}
                />
              </Box>

            </Card>
          </Modal>

        </Box>

      </>
    )
  }
}

export default ViewResultsModal;