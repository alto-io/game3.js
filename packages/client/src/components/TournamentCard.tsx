import React, { Component } from 'react'
import { drizzleConnect } from "@drizzle/react-plugin"
import { navigate } from '@reach/router';

import { Card, Button, Flex, Box, Text } from "rimble-ui";
import RainbowBox from "./RainbowBox";
import RainbowImage from "./RainbowImage";
import JoinPromptModal from "./JoinPromptModal";
import BuyinPromptModal from './BuyInPromptModal';
import ViewResultsModal from './ViewResultsModal';
import SkeletonTournamentLoader from './SkeletonTournamentLoader';
import styled from 'styled-components';

import { format, isPast } from 'date-fns'
import qs from 'querystringify';
import { TOURNAMENT_STATES, TOURNAMENT_STATE_ACTIVE } from '../constants';
import { getGameNo, getGameSessionId, updateTournament } from '../helpers/database';
import { Constants } from "@game3js/common";

import { GraphQlContext } from '../helpers/context/graphql/GraphqlContextProvider';

import web3 from 'web3';

const PrizeBadge = styled.p`
  background-color: #ffb600;
  border-radius: 25px;
  color: #804d00;
  font-family: 'Apercu Bold';
  font-size: 0.825rem;
  padding: 0.5rem 1rem;
  margin: 0 0.25rem 0.5rem 0.25rem;
  text-align: center;
  text-transform: uppercase;
`

const PrizeContainer = styled(Box)`
  display: flex;
  justify-content: flex-start;
  align-self: flex-start;
  flex-direction: column;
  flex-wrap: wrap;
  height: 225px;
  width: 100%;
`

interface IProps {
  account?: any;
  accountValidated?: any;
  address?: any;
  drizzle?: any;
  tournamentId?: any;
  playerAddress?: any;
  connectAndValidateAccount?: any;
}

interface IState {
  tournament?: any;
  address?: any;
  gameId?: any;
  ownTournament: boolean;
  isOpen: boolean;
  isBuyinModalOpen: boolean;
  accountBuyIn: number;
  isContractOwner: boolean;
  gameNo: number;
  gameName: string;
  gameImage: string;
  tournamentLoading: boolean;
  prizeString: Array<any>;
}

class TournamentCard extends Component<IProps, IState> {
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
      gameName: '',
      gameImage: '',
      tournamentLoading: true,
      prizeString: []
    }

    this.handleCloseModal = this.handleCloseModal.bind(this);
    this.handleOpenModal = this.handleOpenModal.bind(this);
    this.handleCloseBuyinModal = this.handleCloseBuyinModal.bind(this);
    this.handleOpenBuyinModal = this.handleOpenBuyinModal.bind(this);
  }

  async componentDidMount() {
    await this.getBlockchainInfo(this.props);

    // Listen to tournamentActivation
    await this.props.drizzle.contracts.Tournaments.events.TournamentActivated().on('data', async (event) => {
      let tId = event.returnValues.tournamentId;

      if (parseInt(this.props.tournamentId) === parseInt(tId)) {
        this.setState({ tournamentLoading: true });
        const raw = await this.props.drizzle.contracts.Tournaments.methods.getTournament(tId).call();

        const updatedTournament = {
          state: raw['3'],
          pool: raw['4']
        }
        console.log("TID UPDATE TO DB", tId);
        await updateTournament(tId, updatedTournament);
        await this.getBlockchainInfo(this.props);
      }
    });
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
      ownTournament,
      tournamentLoading: false
    })

  }

  handleJoinClick = () => {
    const { tournament, gameId } = this.state;

    let options = {}

    switch (gameId) {
      case Constants.WOM:
        options = {
          tournamentId: tournament.id,
          viewOnly: tournament.timeIsUp
        }

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

  showWinnings = async (drizzle, tournament) => {
    if (drizzle && tournament) {
      const contract = drizzle.contracts.Tournaments;
      const shares = await contract.methods.getShares(tournament.id).call();

      let prizeString = [];

      for (let i = 0; i < shares.length; i++) {
        if (i === 0) {
          prizeString.push(`${i + 1}st: ${(parseInt(web3.utils.fromWei(tournament.balance.toString())) * parseInt(shares[i]) / 100)} ETH`);

        } else if (i === 1) {
          prizeString.push(`${i + 1}nd: ${(parseInt(web3.utils.fromWei(tournament.balance.toString())) * parseInt(shares[i]) / 100)} ETH`);
        } else if (i === 2) {
          prizeString.push(`${i + 1}rd: ${(parseInt(web3.utils.fromWei(tournament.balance.toString())) * parseInt(shares[i]) / 100)} ETH`);
        } else {
          prizeString.push(`${i + 1}th: ${(parseInt(web3.utils.fromWei(tournament.balance.toString())) * parseInt(shares[i]) / 100)} ETH`);
        }
      }

      this.setState({
        prizeString
      })
    }
  }

  render() {
    const { tournament, accountBuyIn, isBuyinModalOpen, isOpen, isContractOwner, tournamentLoading, gameNo, gameName, gameImage, prizeString } = this.state
    const { connectAndValidateAccount, account, accountValidated, drizzle, address, connected } = this.props

    if (tournamentLoading) {
      return (
        <Box width={[1, 1 / 2, 1 / 3]} p={3}>
          <SkeletonTournamentLoader />
        </Box>
      )
    }

    const isActive = tournament.state === TOURNAMENT_STATE_ACTIVE

    const endTimeStr = format(new Date(tournament.endTime),
      'MMM d, yyyy, HH:mm:ss')

    const buttonText = tournament.timeIsUp ? 'View' : `Join (${tournament.buyInAmount && web3.utils.fromWei(tournament.buyInAmount.toString())} ETH)`;
    const playBtnText = `Play ( ${typeof gameNo !== "number" ? 0 : gameNo} out of ${tournament.maxTries} )`;

    const button = () => {
      if ((accountBuyIn !== 0 && account && accountValidated) || (accountBuyIn !== 0 && address !== null && connected)) {
        return (
          <Button
            mt={"26px"}
            mb={2}
            type={"text"} // manually set properties on the button so that the handleInputChange and handleSubmit still work properly
            name={"recepient"} // set the name to the method's argument key
            onClick={this.handleJoinClick}
            disabled={gameNo === tournament.maxTries ? "disabled" : ""}
            className="btn-custom"
          >
            {playBtnText}
          </Button>
        )
      } else {
        if (!tournament.timeIsUp) {
          return (
            <Button
              mt={"26px"}
              mb={2}
              type={"text"} // manually set properties on the button so that the handleInputChange and handleSubmit still work properly
              name={"recepient"} // set the name to the method's argument key
              onClick={(account && accountValidated) || (address !== null && connected) ? this.handleOpenBuyinModal : this.handleOpenModal}
              className="btn-custom"
            >
              {buttonText}
            </Button>
          )
        } else {
          return (
            <Button
              mt={"26px"}
              mb={2}
              type={"text"} // manually set properties on the button so that the handleInputChange and handleSubmit still work properly
              name={"recepient"} // set the name to the method's argument key
              onClick={this.handleJoinClick}
              className="btn-custom"
            >
              {buttonText}
            </Button>)
        }
      }
    }

    const prizeRender = prizeString.map((prize, idx) => {
      return (
        <PrizeBadge key={idx}>{prize}</PrizeBadge>
      )
    })

    return (
      <Box width={[1, 1 / 2, 1 / 2, 1 / 3]} p={3}>
        <Card p={0} borderColor={"#d6d6d6"}>
          <RainbowBox height={"5px"} />
          <Flex
            alignItems={"center"}
            justifyContent={"space-between"}
            flexDirection={"column"}
            p={3}
          >
            <Flex justifyContent={"center"} mt={3} mb={3}>
              <RainbowImage src={"images/" + gameImage} />
            </Flex>

            {isActive && (
              <PrizeContainer>
                {prizeString.length > 0 && prizeRender}
              </PrizeContainer>
            )}

            <Flex justifyContent={"center"} mt={3} mb={4}>
              <Text fontWeight={600} lineHeight={"1em"}>
                {gameName} {tournament.gameStage !== undefined ? "- " + tournament.gameStage : ""}
              </Text>
            </Flex>

            <Flex justifyContent={"center"} mt={1} mb={2}>
              <Text fontWeight={300} lineHeight={"0.75em"}>
                {isActive ? (
                  `Ending: ${endTimeStr}`
                ) : (
                    "Ended"
                  )}
              </Text>
            </Flex>
            <Flex justifyContent={"center"} mt={1} mb={2}>
              <Text fontWeight={300} lineHeight={"0.75em"}>
                Status: {TOURNAMENT_STATES[tournament.state]}
              </Text>
            </Flex>

            {/* {!isContractOwner ? button() : ""} */}
            {isActive && button()}
            <ViewResultsModal
              tournamentId={tournament.id}
              playerAddress={address}
              drizzle={drizzle}
            />
            <JoinPromptModal
              isOpen={isOpen}
              handleCloseModal={this.handleCloseModal}
              connectAndValidateAccount={connectAndValidateAccount}
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