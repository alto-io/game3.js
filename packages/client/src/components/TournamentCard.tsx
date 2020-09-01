import React, { Component } from 'react'
import { drizzleConnect } from "@drizzle/react-plugin"

import { format, isPast } from 'date-fns'
import { Card, Button, Flex, Box, Text, Flash } from "rimble-ui";
import RainbowBox from "./RainbowBox";
import RainbowImage from "./RainbowImage";
import JoinPromptModal from "./JoinPromptModal";
import BuyinPromptModal from './BuyInPromptModal';
import { navigate } from '@reach/router';
import qs from 'querystringify';

import web3 from 'web3';
import { TOURNAMENT_STATES, TOURNAMENT_STATE_ACTIVE } from '../constants';
import SmartContractControls from './SmartContractControls';

class TournamentCard extends Component<any, any> {
  constructor(props) {
    super(props)

    this.state = {
      tournament: null,
      ownTournament: false,
      isOpen: false,
      isBuyinModalOpen: false,
      accountBuyIn: 0
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
    const raw = await contract.methods.getTournament(tournamentId).call();
    const tournamentBuyIn = await contract.methods.getBuyIn(tournamentId).call();
    const triesLeft = await contract.methods.getTriesLeft(tournamentId, this.props.address).call();
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
      buyInAmount: tournamentBuyIn,
      triesLeft : triesLeft
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

    let results = [];
    const resultsCount = await contract.methods.getResultsCount(tournamentId).call();
    for (let resultIdx = 0; resultIdx < resultsCount; resultIdx++) {
      const resultDetails = await contract.methods.getResult(tournament.id, resultIdx).call()
        results.push({
          tournamentId: tournament.id,
          resultId: resultIdx,
          isWinner: resultDetails['0'],
          playerAdress: resultDetails['1'],
          sessionData: resultDetails['2']
        })
    }

    tournament.results = results;

    const buyIn = await contract.methods.buyIn(tournamentId, address).call();
    this.setState({accountBuyIn : parseInt(buyIn)})
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

  onActivate = (tournament) => {
    this.activateTournament(tournament)
  }

  activateTournament = async (tournament) => {
    const { drizzle } = this.props

    const address = this.state.address;
    const contract = drizzle.contracts.Tournaments;

    await contract.methods.activateTournament(tournament.id, tournament.prize)
      .send({
        from: address,
        value: tournament.prize
      })
  }

  render () {
    const { tournament, ownTournament, accountBuyIn, isBuyinModalOpen, isOpen } = this.state
    const { connectAndValidateAccount, account, accountValidated, drizzle, address } = this.props

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

    const button = () => {
      if (accountBuyIn === 0 ) {
        if (!tournament.timeIsUp) {
          return(
            <Button
              mt={"26px"}
              mb={2}
              type={"text"} // manually set properties on the button so that the handleInputChange and handleSubmit still work properly
              name={"recepient"} // set the name to the method's argument key
              onClick={this.props.account && this.props.accountValidated ? this.handleOpenBuyinModal : this.handleOpenModal}
            >
              {buttonText}
              </Button>
          )
        } else {
          return(
          <Button
            mt={"26px"}
            mb={2}
            type={"text"} // manually set properties on the button so that the handleInputChange and handleSubmit still work properly
            name={"recepient"} // set the name to the method's argument key
            onClick={this.handleJoinClick}
          >
            {buttonText}
          </Button>)
        }
      } else {
        return(
          <Flash my={3} variant="success">
            You have some tries left
          </Flash>
        )
      }
    }

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
                {/* Prize: { web3.utils.fromWei(tournament.prize)} ETH */}
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
                Status: {  TOURNAMENT_STATES[tournament.state] }
              </Text>
            </Flex>

            {button()}

            {/* <Button onClick={() => {this.onActivate(tournament)}}>Activate</Button> */}
            <JoinPromptModal 
              isOpen={isOpen}
              handleCloseModal={this.handleCloseModal}
              connectAndValidateAccount={connectAndValidateAccount}
              account={account}
              accountValidated={accountValidated}
              modalText={"You need to be logged in to join a tournament"}
            />

            <BuyinPromptModal 
              isOpen={isBuyinModalOpen}
              handleCloseBuyinModal={this.handleCloseBuyinModal}
              handleJoinClick={this.handleJoinClick}
              drizzle={drizzle}
              tournamentId={tournament.id}
              tournamentBuyInAmount={tournament.buyInAmount}
              address={address}
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