import React, { Component } from 'react'
import { drizzleConnect } from "@drizzle/react-plugin"
import { navigate } from '@reach/router';

import { Card, Button, Flex, Box, Text } from "rimble-ui";
import RainbowBox from "./RainbowBox";
import RainbowImage from "./RainbowImage";
import JoinPromptModal from "./JoinPromptModal";
import BuyinPromptModal from './BuyInPromptModal';
import ViewResultsModal from './ViewResultsModal';
import styled from 'styled-components';

import { format, isPast } from 'date-fns'
import qs from 'querystringify';
import { TOURNAMENT_STATES, TOURNAMENT_STATE_ACTIVE } from '../constants';
import { getGameNo, getGameSessionId } from '../helpers/database';
// import { GAME_DETAILS } from '../constants';
import { Constants } from "@game3js/common";

import web3 from 'web3';

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
      gameId: null,
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
      prizeString: ''
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
      gameId: data[0],
      gameStage: data[1],
      timeIsUp: false,
      canDeclareWinner: true,
      results: [],
      buyInAmount: tournamentBuyIn,
      maxTries: parseInt(maxTries)
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
    this.setState({ accountBuyIn: parseInt(buyIn) });
    this.fetchGameNo(address, tournamentId);

    let ownTournament = false
    if (address) {
      ownTournament = tournament.organizer.toLowerCase() === address.toLowerCase()
    }

    this.getGameDetails(tournament.gameId);
    await this.showWinnings(drizzle, tournament);

    this.setState({
      gameId: tournament.gameId,
      tournament,
      ownTournament
    })

  }

  handleJoinClick = () => {
    const { tournament, gameId } = this.state
    // const name = window.prompt("Enter your name", "");
    // console.log(`Hi ${name}!`);

    let options = {}

    switch (gameId) {
      case Constants.WOM:
        navigate(`/game/wom${qs.stringify(options, true)}`);

        break;
      case Constants.TOSIOS:
        options = {
          mode: 'score attack',
          roomMap: 'small',
          roomMaxPlayers: '1',
          roomName: '',
          tournamentId: tournament.id,
          playerName: "Guest",
          viewOnly: tournament.timeIsUp
        }
        navigate(`/game/new${qs.stringify(options, true)}`);
        break;
      case Constants.FP:
        options = {
          tournamentId: tournament.id,
          viewOnly: tournament.timeIsUp
        }
        navigate(`/game/flappybird${qs.stringify(options, true)}`);
        break;
    }
  }

  handleCloseModal = e => {
    this.setState({ isOpen: false });
  }

  handleOpenModal = e => {
    e.preventDefault();
    this.setState({ isOpen: true });
  }

  handleCloseBuyinModal = e => {
    this.setState({ isBuyinModalOpen: false })
  }

  handleOpenBuyinModal = e => {
    this.setState({ isBuyinModalOpen: true })
  }

  checkOwner = async () => {
    const { drizzle, address } = this.props;
    const contract = drizzle.contracts.Tournaments;
    const owner = await contract.methods.owner().call();


    if (owner.toLowerCase() !== address.toLowerCase()) {
      this.setState({ isContractOwner: false })
    } else {
      this.setState({ isContractOwner: true })
    }
  }

  fetchGameNo = async (account, tournamentId) => {
    const gameSessionId = await getGameSessionId(account, tournamentId);
    const gameNo = await getGameNo(gameSessionId, account, tournamentId);
    this.setState({ gameNo: gameNo });
  }

  parseData(data) {
    console.log("The data is", data)
    return data.split(' ').join('').split(",");
  }

  getGameDetails = (gameId) => {
    switch (gameId) {
      case Constants.WOM:
        this.setState({
          gameName: 'World of Mines',
          gameImage: Constants.WOM_IMG
        });
        break;
      case Constants.TOSIOS:
        this.setState({
          gameName: 'TOSIOS',
          gameImage: Constants.TOSIOS_IMG
        });
        break;
      case Constants.FP:
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

  showWinnings = async (drizzle, tournament) => {
    if (drizzle && tournament) {
      const contract = drizzle.contracts.Tournaments;
      const shares = await contract.methods.getShares(tournament.id).call();
  
      let prizeString = '';
  
      for(let i = 0; i < shares.length; i++) {
        if (i === 0) {
          prizeString += `${(parseInt(web3.utils.fromWei(tournament.balance.toString())) * parseInt(shares[i]) / 100)} ETH (${i + 1}st)`
        } else if (i === 1) {
          prizeString += `, ${(parseInt(web3.utils.fromWei(tournament.balance.toString())) * parseInt(shares[i]) / 100)} ETH (${i + 1}nd)`
        } else if (i === 2) {
          prizeString += `, ${(parseInt(web3.utils.fromWei(tournament.balance.toString())) * parseInt(shares[i]) / 100)} ETH (${i + 1}rd)`
        } else {
          prizeString += `, ${(parseInt(web3.utils.fromWei(tournament.balance.toString())) * parseInt(shares[i]) / 100)} ETH (${i + 1}th)`
        } 
      }

      console.log("PRIZE STRING:", prizeString)
      this.setState({
        prizeString
      })
    }
  }

  render() {
    const { tournament, accountBuyIn, isBuyinModalOpen, isOpen, isContractOwner, gameNo, gameName, gameImage, prizeString } = this.state
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

    const buttonText = tournament.timeIsUp ? 'View' : `Join (${tournament.buyInAmount && web3.utils.fromWei(tournament.buyInAmount.toString())} ETH)`;
    const playBtnText = `Play ( ${typeof gameNo !== "number" ? 0 : gameNo} out of ${tournament.maxTries} )`;

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
          return (
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
          return (
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
                Prize: { prizeString && prizeString }
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
                Status: {TOURNAMENT_STATES[tournament.state]}
              </Text>
            </Flex>

            {/* {!isContractOwner ? button() : ""} */}
            {button()}
            <ViewResultsModal
              tournamentId={tournament.id}
              playerAddress={address}
              drizzle={drizzle}
            />
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