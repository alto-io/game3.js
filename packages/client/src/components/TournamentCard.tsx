import React, { Component } from 'react'
import { drizzleConnect } from "@drizzle/react-plugin"
import { navigate } from '@reach/router';

import { Card, Button, Flex, Box, Text } from "rimble-ui";
import RainbowBox from "./RainbowBox";
import RainbowImage from "./RainbowImage";
import JoinPromptModal from "./JoinPromptModal";
import BuyinPromptModal from './BuyInPromptModal';
import styled from 'styled-components';

import { format, isPast } from 'date-fns'
import qs from 'querystringify';
import { TOURNAMENT_STATES, TOURNAMENT_STATE_ACTIVE } from '../constants';
import { getGameNo, getGameSessionId } from '../helpers/database';
// import { GAME_DETAILS } from '../constants';
import { Constants } from "@game3js/common";

const StyledButton = styled(Button)`
  font-family: 'Apercu Light';
  font-size: 0.75rem;
  letter-spacing: 0.4px;
  text-transform: uppercase;
`

class TournamentCard extends Component<any, any> {
  constructor(props) {
    super(props)

    this.state = {
      tournament: null,
      ownTournament: false,
      isOpen: false,
      isBuyinModalOpen: false,
      accountBuyIn: 0,
      isContractOwner: false,
      gameNo: 0,
      gameDetails: {
        name: '',
        image: ''
      },
    }
    this.handleCloseModal = this.handleCloseModal.bind(this);
    this.handleOpenModal = this.handleOpenModal.bind(this);
    this.handleCloseBuyinModal = this.handleCloseBuyinModal.bind(this);
    this.handleOpenBuyinModal = this.handleOpenBuyinModal.bind(this);
  }

  componentDidMount() {
    this.getBlockchainInfo(this.props);
  }

  componentDidUpdate() {
    if (this.props.account && this.props.accountValidated) {
      this.checkOwner();
    }
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
    const maxTries = await contract.methods.getMaxTries(tournamentId).call();
    const data = this.parseData(raw['5']);

    const tournament = {
      id: tournamentId,
      organizer: raw['0'],
      endTime: parseInt(raw['1']),
      prize: raw['2'],
      state: parseInt(raw['3']),
      balance: raw['4'],
      gameName: data[0],
      gameStage: data[1],
      timeIsUp: false,
      canDeclareWinner: true,
      results: [],
      buyInAmount: tournamentBuyIn,
      maxTries : parseInt(maxTries)
    }

    tournament.timeIsUp = isPast(new Date(tournament.endTime))

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
    this.setState({accountBuyIn : parseInt(buyIn)});
    this.fetchGameNo(address, tournamentId);

    let ownTournament = false
    if (address) {
      ownTournament = tournament.organizer.toLowerCase() === address.toLowerCase()
    }

    this.getGameDetails(tournament.gameName);

    this.setState({
      tournament,
      ownTournament
    })

  }

  handleJoinClick = () => {
    const { tournament } = this.state
    // const name = window.prompt("Enter your name", "");
    // console.log(`Hi ${name}!`);
    const options = {
      mode: 'score attack',
      roomMap: 'small',
      roomMaxPlayers: '1',
      roomName: '',
      tournamentId: tournament.id,
      playerName: "Guest",
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

  checkOwner = async () => {
    const { drizzle, address } = this.props;
    const contract = drizzle.contracts.Tournaments;
    const owner = await contract.methods.owner().call();


    if (owner.toLowerCase() !== address.toLowerCase()) {
      this.setState({isContractOwner: false})
    } else {
      this.setState({isContractOwner: true})
    }
  }

  fetchGameNo = async (account, tournamentId) => {
    const gameSessionId = await getGameSessionId(account, tournamentId);
    const gameNo = await getGameNo(gameSessionId, account, tournamentId);
    this.setState({ gameNo : gameNo });
  }

  parseData(data) {
    console.log("The data is", data)
    return data.split(' ').join('').split(",");
  }

  getGameDetails = (gameName) => {
    switch (gameName) {
      case 'wom':
        this.setState({
          gameName: 'World of Mines',
          gameImage: Constants.WOM_IMG
        });
        break;
      case 'tosios':
        this.setState({
          gameName: 'TOSIOS',
          gameImage: Constants.TOSIOS_IMG
        });
        break;
      case 'fp':
        this.setState({
          gameName: 'Flappy Bird Open-Source',
          gameImage: Constants.FP_IMG
        });
      break; 
    }
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
    const { tournament, accountBuyIn, isBuyinModalOpen, isOpen, isContractOwner, gameNo, gameName, gameImage } = this.state
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

    const buttonText = tournament.timeIsUp ? 'View' : 'Join';
    const playBtnText = `Play (${typeof gameNo !== "number" ? 0 : gameNo} out of ${tournament.maxTries})`;

    const button = () => {
      if (accountBuyIn !== 0 && account && accountValidated) {
        return (
          <StyledButton
            mt={"26px"}
            mb={2}
            type={"text"} // manually set properties on the button so that the handleInputChange and handleSubmit still work properly
            name={"recepient"} // set the name to the method's argument key
            onClick={this.handleJoinClick} 
            disabled={gameNo === tournament.maxTries ? "disabled" : ""}
          >
            {playBtnText}
          </StyledButton>
        )
      } else {
        if (!tournament.timeIsUp) {
          return(
            <StyledButton
              mt={"26px"}
              mb={2}
              type={"text"} // manually set properties on the button so that the handleInputChange and handleSubmit still work properly
              name={"recepient"} // set the name to the method's argument key
              onClick={account && accountValidated ? this.handleOpenBuyinModal : this.handleOpenModal}
            >
              {buttonText}
            </StyledButton>
          )
        } else {
          return(
          <StyledButton
            mt={"26px"}
            mb={2}
            type={"text"} // manually set properties on the button so that the handleInputChange and handleSubmit still work properly
            name={"recepient"} // set the name to the method's argument key
            onClick={this.handleJoinClick}
          >
            {buttonText}
          </StyledButton>)
        }
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
                {gameName} {tournament.gameStage !== undefined ? "- " + tournament.gameStage : ""}
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

            {!isContractOwner ? button() : ""}

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
              maxTries={tournament.maxTries}
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