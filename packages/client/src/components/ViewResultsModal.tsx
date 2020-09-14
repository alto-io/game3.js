import React, { Component } from 'react';
import { Box, Modal, Button, Card } from 'rimble-ui';

import TournamentResultsCard from './TournamentResultsCard';

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
          <Button onClick={this.openModal} className="btn-custom">View Results</Button>

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

              <Box p={4} mt={4}>
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