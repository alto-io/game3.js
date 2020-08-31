import React, { Component } from 'react'
import { drizzleConnect } from "@drizzle/react-plugin"

import { format, isPast } from 'date-fns'
import { Card, Button, Flex, Box, Text } from "rimble-ui";
import RainbowBox from "./RainbowBox";
import RainbowImage from "./RainbowImage";
import JoinPromptModal from "./JoinPromptModal";
import BuyinPromptModal from './BuyInPromptModal';
import { navigate } from '@reach/router';
import qs from 'querystringify';

import { TOURNAMENT_STATE_ACTIVE } from '../constants'

class TournamentCard extends Component<any, any> {
  constructor(props) {
    super(props)

    this.state = {
      tournament: null,
      ownTournament: false,
      isOpen: false,
      isBuyinModalOpen: false
    }
    this.handleCloseModal = this.handleCloseModal.bind(this);
    this.handleOpenModal = this.handleOpenModal.bind(this);
    this.handleCloseBuyinModal = this.handleCloseBuyinModal.bind(this);
    this.handleOpenBuyinModal = this.handleOpenBuyinModal.bind(this);
  }

  componentDidMount() {
    this.getBlockchainInfo(this.props)
  }

  componentWillReceiveProps(newProps) {
    const { tournamentId, address } = this.props
    const { tournamentId: newId, address: newAddress } = newProps

    if (tournamentId !== newId || address !== newAddress) {
      this.getBlockchainInfo(newProps)
    }
  }

  getBlockchainInfo = async (props) => {
    const { tournamentId, drizzle, address } = props

    const contract = drizzle.contracts.Tournaments;
    const raw = await contract.methods.getTournament(tournamentId).call()
    const tournament = {
      id: tournamentId,
      organizer: raw['0'],
      endTime: parseInt(raw['1']),
      prize: raw['2'],
      state: parseInt(raw['3']),
      balance: raw['4'],
      timeIsUp: false,
      canDeclareWinner: true,
      results: [],
    }
    tournament.timeIsUp = isPast(new Date(tournament.endTime))

    let ownTournament = false
    if (address) {
      ownTournament = tournament.organizer.toLowerCase() === address.toLowerCase()
    }

    this.setState({
      tournament,
      ownTournament
    })

    console.log(tournament);
  }

  handleJoinClick = () => {
    const { tournament } = this.state

    const options = {
      mode: 'score attack',
      roomMap: 'small',
      roomMaxPlayers: '1',
      roomName: '',
      tournamentId: tournament.id,
      playerName: 'You',
      viewOnly: tournament.timeIsUp
    }
    navigate(`/game/new${qs.stringify(options, true)}`);
  }

  handleCloseModal = e => {
    this.setState({isOpen: false});
  }

  handleOpenModal = e => {
    e.preventDefault();
    this.setState({isOpen: true});
  }

  handleCloseBuyinModal = e => {
    this.setState({isBuyinModalOpen: false})
  }

  handleOpenBuyinModal = e => {
    this.setState({isBuyinModalOpen: true})
  }

  render () {
    const { tournament, ownTournament } = this.state

    const hasTournament = !!tournament

    if (!hasTournament) {
      return (
        <Box width={[1, 1 / 2, 1 / 3]} p={3}>
          <Card p={0} borderColor={"#d6d6d6"}>
            Loading...
          </Card>
        </Box>
      )
    }

    const isActive = tournament.state === TOURNAMENT_STATE_ACTIVE
    // don't show own tournaments
    // if (ownTournament || !isActive) {
    //   return (null)
    // }

//    const prizeStr = `${drizzle.web3.utils.fromWei(tournament.prize)} ETH`
    const endTimeStr = format(new Date(tournament.endTime),
      'MMM d, yyyy, HH:mm:ss')

    const gameName = 'TOSIOS'
    const gameImage = 'tosios.gif'
    const buttonText = tournament.timeIsUp ? 'View' : 'Join'

    return (
      <Box width={[1, 1 / 2, 1 / 3]} p={3}>
        <Card p={0} borderColor={"#d6d6d6"}>
          <RainbowBox height={"5px"} />
          <Flex
            alignItems={"center"}
            justifyContent={"space-between"}
            flexDirection={"column"}
            p={3}
          >
            <Flex justifyContent={"center"} mt={3} mb={4}>
              <RainbowImage src={"images/" + gameImage} />
            </Flex>

            <Flex justifyContent={"center"} mt={3} mb={4}>
              <Text fontWeight={600} lineHeight={"1em"}>
                Prize: {tournament.prize} ETH
              </Text>
            </Flex>

            <Flex justifyContent={"center"} mt={3} mb={4}>
              <Text fontWeight={600} lineHeight={"1em"}>
                {gameName}
              </Text>
            </Flex>
            <Flex justifyContent={"center"} mt={1} mb={2}>
              <Text fontWeight={300} lineHeight={"0.75em"}>
                Ending: {endTimeStr}
              </Text>
            </Flex>
            <Flex justifyContent={"center"} mt={1} mb={2}>
              <Text fontWeight={300} lineHeight={"0.75em"}>
                Status: { tournament.timeIsUp ? 'Closed' : 'Active' }
              </Text>
            </Flex>


            {!tournament.timeIsUp ? (
              <Button
              mt={"26px"}
              mb={2}
              type={"text"} // manually set properties on the button so that the handleInputChange and handleSubmit still work properly
              name={"recepient"} // set the name to the method's argument key
              onClick={this.props.account && this.props.accountValidated ? this.handleOpenBuyinModal : this.handleOpenModal}
            >
              {buttonText}
              </Button>
            ) : (
              <Button
                mt={"26px"}
                mb={2}
                type={"text"} // manually set properties on the button so that the handleInputChange and handleSubmit still work properly
                name={"recepient"} // set the name to the method's argument key
                onClick={this.handleJoinClick}
              >
                {buttonText}
              </Button>
            )}

            <JoinPromptModal 
              isOpen={this.state.isOpen}
              handleCloseModal={this.handleCloseModal}
              connectAndValidateAccount={this.props.connectAndValidateAccount}
              account={this.props.account}
              accountValidated={this.props.accountValidated}
              modalText={"You need to be logged in to join a tournament"}
            />

            <BuyinPromptModal 
              isOpen={this.state.isBuyinModalOpen}
              handleCloseBuyinModal={this.handleCloseBuyinModal}
              handleJoinClick={this.handleJoinClick}
              drizzle={this.props.drizzle}
              tournamentId={tournament.id}
              tournamentBalance={tournament.balance}
            />
          </Flex>
        </Card>
      </Box>
    )
  }
}

const mapStateToProps = state => {
  return {
    drizzleStatus: state.drizzleStatus,
    address: state.accounts[0],
    networkId: state.web3.networkId
  };
};

export default drizzleConnect(TournamentCard, mapStateToProps)