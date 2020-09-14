import React, { Component } from 'react';
import { RouteComponentProps, navigate } from '@reach/router';
import { Button } from 'rimble-ui';
import styled from 'styled-components';

import JoinPromptModal from './JoinPromptModal';
import BuyinPromptModal from './BuyInPromptModal';
import SkeletonLeaderboardLoader from './SkeletonLeaderboardLoader';
import Modal from './Modal';
import PlayerGameReplays from './PlayerGameReplays';

import { getTournamentResult, getTournament, getGameNo, getGameSessionId, getTournaments } from '../helpers/database'
import shortenAddress from "../core/utilities/shortenAddress";
import { Constants } from '@game3js/common';
import web3 from 'web3';
import qs from 'querystringify';
import { format } from 'date-fns';

import CSS from 'csstype';
import { baseColors, fonts, shadows, } from '../styles';

import {
  TOURNAMENT_STATE_ACTIVE,
  TOURNAMENT_STATE_ENDED,
  TOURNAMENT_STATE_DRAFT
} from '../constants'

const SharesText = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  .place {
    font-family: 'Apercu Bold', sans-serif;
    font-weight: bold;
    width: 33%;
  }

  .trophy {
    width: 33%;
    text-align: center;
  }
  
  .share {
    width: 33%;
    text-align: right;
  }
`;

const ResultDivStyle = styled.div`
 display: flex;
 justify-content: space-between;
 align-items: center;
 font-size: 0.825rem;
 letter-spacing: 0.1px;
 padding: 0.5rem;
 cursor: pointer;

 .address {
   font-weight: bold;
   margin: 0;
 }

 .shares {
   margin: 0;
 }

 .score {
   color: #0093d5;
   font-family: 'Apercu Bold';
   margin: 0;
   text-align: right;
   width: 33%;
 }
 `

const JoinTourneyBtn = styled(Button)`
  color: #101010;
  font-family: 'Apercu Light';
  font-size: 0.825rem;
  letter-spacing: 0.4px;
  text-transform: uppercase;
  width: 100%;
 `

class TournamentResultsCard extends Component<any, any> {
  constructor(props) {
    super(props)

    this.state = {
      results: [],
      tournament: {},
      isLoading: false,
      shares: [],
      isJoinModalOpen: false,
      isBuyinModalOpen: false,
      isReplayModalOpen: false,
      currentFileHash: '',
      accountBuyIn: 0,
      gameNo: 0,
      tournamentId: '',
      loggedIn: ''
    }

    this.handleCloseJoinModal = this.handleCloseJoinModal.bind(this);
    this.handleOpenJoinModal = this.handleOpenJoinModal.bind(this);
    this.handleCloseBuyinModal = this.handleCloseBuyinModal.bind(this);
    this.handleOpenBuyinModal = this.handleOpenBuyinModal.bind(this);
  }

  async componentDidMount() {
    await this.getBlockchainInfo(this.props)

    window.addEventListener('gameend', await this.refreshResults)
  }

  async componentWillUnmount() {
    window.removeEventListener('gameend', await this.refreshResults)
  }

  async componentWillReceiveProps(newProps) {
    const { tournamentId, address } = this.props
    const { tournamentId: newId, address: newAddress } = newProps

    if (tournamentId !== newId || address !== newAddress) {
      await this.getBlockchainInfo(newProps)
    }
  }

  parseData(data) {
    console.log("The data is", data)
    return data.split(' ').join('').split(",");
  }

  refreshResults = async () => {
    const { tournamentId } = this.state;
    let results = [];
    let sessionsData = await getTournamentResult(tournamentId);
    console.log("PLAYER ADD: sessionsData", sessionsData);

    if (sessionsData.length > 0) {
      for (let resultIdx = 0; resultIdx < (sessionsData.length > 10 ? 10 : sessionsData.length); resultIdx++) {
        let playerAddress = Object.keys(sessionsData[resultIdx].sessionData.playerData)[0];
        console.log("PLAYER ADD: address", playerAddress);

        results.push({
          gameName: sessionsData[resultIdx].sessionData.gameName,
          tournamentId: tournamentId,
          timeIsUp: false,
          playerAddress,
          sessionId: sessionsData[resultIdx].id,
          sessionData: sessionsData[resultIdx].sessionData.playerData[playerAddress]
        })
      }

      console.log("RESULTS:", results)
      results = results.filter(result => !!result.sessionData)
      if (results.length > 1) {
        // Sorts in ascending order
        results.sort((el1, el2) => {
          switch (el1.gameName) {
            case Constants.FP:
              return el2.sessionData.highScore - el1.sessionData.highScore
            case Constants.TOSIOS:
              return el1.sessionData.currentHighestNumber - el2.sessionData.currentHighestNumber
            case Constants.WOM:
              return el1.sessionData.highScore - el2.sessionData.highScore
            default:
              break;
          }
        })
      }
    }
    this.setState({
      results
    })
  }

  getTournamentAndLeaderBoards = async () => {
    const { drizzle, address, playerAddress, accountValidated } = this.props;
    const { tournamentId, loggedIn } = this.state;

    this.setState({ isLoading: true })

    console.log(`getBlockchainInfo: ${tournamentId}`)
    const contract = drizzle.contracts.Tournaments;
    let results = [];
    let tournament = {
      id: '',
      name: '',
      gameStage: undefined,
      timeZone: '',
      startTime: '',
      endTime: '',
      startDate: '',
      endDate: '',
      state: 0,
      pool: '',
      maxTries: 0,
      buyInAmount: 0
    }

    // Get tournament info

    if (tournamentId === undefined) {
      tournament = null

      return this.setState({
        results,
        tournament,
        isLoading: false
      })
    }

    let raw = undefined;
    if (loggedIn) {
      raw = await contract.methods.getTournament(tournamentId).call()
      await this.fetchShares(tournamentId);
      let data = this.parseData(raw['5']);
      const gameName = data[0];
      const gameStage = data[1] ? data[1] : undefined;
      const maxTries = await contract.methods.getMaxTries(tournamentId).call();
      const tournamentBuyIn = await contract.methods.getBuyIn(tournamentId).call();

      if (playerAddress && accountValidated) {
        const accountBuyIn = await contract.methods.buyIn(tournamentId, playerAddress).call();
        this.setState({ accountBuyIn });
      }

      tournament = {
        id: tournamentId,
        name: gameName,
        gameStage: gameStage,
        timeZone: 'GMT+8',
        startTime: '12:00',
        endTime: format(new Date(parseInt(raw['1'])), 'MMM d, yyyy'),
        startDate: '8/16',
        endDate: '9/4',
        state: parseInt(raw['3']),
        pool: raw['4'],
        maxTries: parseInt(maxTries),
        buyInAmount: tournamentBuyIn
      }

      this.fetchGameNo(playerAddress, tournamentId);
    } else {
      raw = await getTournament(tournamentId);
      console.log("TOURNAMENT DATA FROM DB", raw);
      let data = this.parseData(raw[0].data);
      let gameName = data[0];
      tournament = {
        id: tournamentId,
        name: gameName,
        gameStage: data[1] ? data[1] : undefined,
        timeZone: 'GMT+8',
        startTime: '12:00',
        endTime: format(new Date(parseInt(raw[0].endTime)), 'MMM d, yyyy'),
        startDate: '8/16',
        endDate: '9/4',
        state: parseInt(raw[0].state),
        pool: raw[0].pool
      }
      console.log("FETCH SHARES NOT LOGGED IN", raw[0].shares);
      console.log("FETCH POOL NOT LOGGED IN", raw[0].pool);
      this.setState({
        shares: raw[0].shares
      })
    }

    // switch (tournament.name) {
    //   case Constants.WOM:
    //     tournament.gameStage = "United Kingdom";
    //     break;
    //   default:
    //     tournament.gameStage = undefined;
    //     break;
    // }

    // Get tournament results
    // const resultsCount = await contract.methods.getResultsCount(tournamentId).call()
    let sessionsData = await getTournamentResult(tournamentId);
    console.log("PLAYER ADD: sessionsData", sessionsData);

    if (sessionsData.length > 0) {
      for (let resultIdx = 0; resultIdx < (sessionsData.length > 10 ? 10 : sessionsData.length); resultIdx++) {
        let playerAddress = Object.keys(sessionsData[resultIdx].sessionData.playerData)[0];
        console.log("PLAYER ADD: address", playerAddress);

        results.push({
          gameName: sessionsData[resultIdx].sessionData.gameName,
          tournamentId: tournamentId,
          timeIsUp: false,
          playerAddress,
          sessionId: sessionsData[resultIdx].id,
          sessionData: sessionsData[resultIdx].sessionData.playerData[playerAddress]
        })
      }
      // let sessions = [];
      // results.forEach(result => {
      //   session = await 
      // })

      // const sessions = await Promise.all(results.map(async result => {
      //   const session = await getGameSession(result.sessionId, result.playerAddress, tournamentId);
      //   return session;
      // }))  

      // results.forEach((result, idx) => result.sessionData = sessions[idx])
      console.log("RESULTS:", results)
      results = results.filter(result => !!result.sessionData)
      if (results.length > 1) {
        // Sorts in ascending order
        results.sort((el1, el2) => {
          switch (el1.gameName) {
            case Constants.FP:
              return el2.sessionData.highScore - el1.sessionData.highScore
            case Constants.TOSIOS:
              return el1.sessionData.currentHighestNumber - el2.sessionData.currentHighestNumber
            case Constants.WOM:
              return el1.sessionData.highScore - el2.sessionData.highScore
            default:
              break;
          }
        })
      }
    }
    this.setState({
      results,
      tournament,
      isLoading: false
    })
  }

  getBlockchainInfo = async (props) => {
    const { tournamentId } = props

    if (this.props.drizzle.contracts.Tournaments) {
      const { drizzle } = this.props;
      // Get the latest tournament
      const contract = drizzle.contracts.Tournaments;

      console.log("TOURNAMENT ID = ", tournamentId)
      const tournamentLength = await contract.methods.getTournamentsCount().call();
      let tI = undefined;
      if (tournamentLength > 0) {
        tI = tournamentId || tournamentId === 0 ? tournamentId : tournamentLength - 1;
      }

      this.setState({
        tournamentId: tI,
        loggedIn: true
      })

      await this.getTournamentAndLeaderBoards();
    } else {
      let ids = await getTournament();
      console.log("IDSSSS", ids);
      let tId = undefined;
      if (ids.length > 0) {
        tId = ids[ids.length - 1].id
      }
      console.log("THE ID IN DB IS", tId);

      this.setState({
        tournamentId: tId,
        LoggedIn: false
      })

      await this.getTournamentAndLeaderBoards();
    }
  }

  getStatus(tournament: any) {
    switch (tournament.state) {
      case TOURNAMENT_STATE_DRAFT:
        return 'Draft'
      case TOURNAMENT_STATE_ACTIVE:
        return 'Active'
      case TOURNAMENT_STATE_ENDED:
        return 'Done'
      default:
        return 'None'
    }
  }

  formatTourneyTimeInfo(tournament: any) {
    const {
      startDate,
      endTime,
      startTime,
      timeZone
    } = tournament;
    let info =
      `Ends on ${endTime} ${timeZone}`;

    return info;
  }

  // Formats the title of the tournament along with its ID 
  formatTourneyTitle(tournament: any) {
    return `${tournament.name} #${tournament.id}`;
  }

  handleJoinClick = () => {
    const { tournament } = this.state;
    let options = {};

    const tosiosOptions = {
      mode: 'score attack',
      roomMap: 'small',
      roomMaxPlayers: '1',
      roomName: '',
      tournamentId: tournament.id,
      playerName: "Guest",
      viewOnly: tournament.timeIsUp
    }

    switch (tournament.name) {
      case Constants.WOM:
        navigate(`/game/wom${qs.stringify(options, true)}`); //Join tourney for wom
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
        navigate(`/game/flappybird${qs.stringify(options, true)}`); //Join tourney for flappy bird
        break;
      default:
        break;
    }
  }

  setResultBgColor(playerAddress, currentPlayerAddress) {
    if (playerAddress && playerAddress.toLowerCase() === currentPlayerAddress.toLowerCase()) {
      return baseColors.lightGrey;
    } else {
      return baseColors.white;
    }
  }

  fetchShares = async (tournamentId) => {
    console.log("FETCH SHARES");
    const { drizzle } = this.props;

    try {
      const contract = drizzle.contracts.Tournaments;
      const shares = await contract.methods.getShares(tournamentId).call();
      this.setState({ shares });
    }
    catch (e) { }
  }

  setTrophy(idx, shares) {
    if (idx < shares.length) {
      switch (idx) {
        case 0:
          return <span>&#x1F947;</span>
        case 1:
          return <span>&#x1F948;</span>
        case 2:
          return <span>&#x1F949;</span>
      }
    }
  }

  setDisplayScore(result) {
    switch (result.gameName) {
      case Constants.FP:
        return result.sessionData.highScore || 0
      case Constants.TOSIOS:
        return this.formatTime(result.gameName, result.sessionData.currentHighestNumber, true)
      case Constants.WOM:
        return this.formatTime(result.gameName, result.sessionData.highScore, true);
      default:
        return ''
    }
  }

  formatTime = (gameName, time, isLeaderBoards?: boolean) => {
    if (time) {
      let minutes: any;
      let seconds: any;
      switch (gameName) {
        case Constants.TOSIOS:
          seconds = (parseInt(time) / 1000).toFixed(2);
          minutes = Math.floor(parseInt(seconds) / 60);
          let totalTime = '';
          if (parseInt(seconds) > 60) {
            let sec = (parseInt(seconds) % 60).toFixed(2);

            totalTime += isLeaderBoards ? (minutes + ":" + sec).toString() : (minutes + "min" + " " + sec + "sec").toString()
          } else {
            totalTime += isLeaderBoards ? ("0:" + seconds).toString() : (seconds + "sec").toString()
          }
          return totalTime
        case Constants.WOM:
          minutes = time >= 60 ? Math.floor(time / 60) : 0;
          seconds = time >= 60 ? (time % 60).toFixed(2) : time.toFixed(2);
          return `${minutes}:${seconds}`;
      }
    } else {
      return 0
    }
  }

  toggleModal = (fileHash, shouldRender) => {
    if (shouldRender) {
      this.setState({
        isReplayModalOpen: !this.state.isReplayModalOpen,
        currentFileHash: fileHash
      })
    }
  }

  handleReplayModal = () => {
    this.setState({
      isReplayModalOpen: !this.state.isReplayModalOpen,
    })
  }

  handleCloseJoinModal = e => {
    this.setState({ isJoinModalOpen: false });
  }

  handleOpenJoinModal = e => {
    this.setState({ isJoinModalOpen: true });
  }

  handleCloseBuyinModal = e => {
    this.setState({ isBuyinModalOpen: false });
  }

  handleOpenBuyinModal = e => {
    this.setState({ isBuyinModalOpen: true });
  }

  fetchGameNo = async (account, tournamentId) => {
    const gameSessionId = await getGameSessionId(account, tournamentId);
    const gameNo = await getGameNo(gameSessionId, account, tournamentId);
    this.setState({ gameNo: gameNo });
  }

  extractHighScore = result => {
    
    let gameName = result.gameName;

    switch(gameName) {
      case Constants.TOSIOS:
        return result.sessionData.currentHighestNumber;
      case Constants.WOM:
        return result.sessionData.highScore;
      case Constants.FP:
        return result.sessionData.highScore;
      default:
        break;
    }
  }

  render() {
    const { currentFileHash, isReplayModalOpen, results, isLoading, tournament, shares, isJoinModalOpen, isBuyinModalOpen, gameNo, accountBuyIn } = this.state;
    const { tournamentId, playerAddress, accountValidated, connectAndValidateAccount, drizzle } = this.props;

    if (isLoading) {
      return (
        <SkeletonLeaderboardLoader />
      )
    }

    let resultDivs = null;

    if (results.length > 0) {

      resultDivs = results.map((result, idx) => {

        if (result.sessionData) {
          return (
            <ResultDivStyle
              style={{
                background: `rgb(${this.setResultBgColor(playerAddress, result.playerAddress)})`
              }}
              key={result.sessionId}
              onClick={() => this.toggleModal(result.sessionData.replayHash, this.extractHighScore(result) !== 0)}
            >
              <p className="address" style={{ width: shares !== undefined ? '33%' : '50%' }}>
                {shortenAddress(result.playerAddress)}
              </p>
              {shares !== undefined && idx < shares.length ? (
                <p className="shares">{this.setTrophy(idx, shares)} {(parseInt(web3.utils.fromWei(tournament.pool)) * parseInt(shares[idx]) / 100)} ETH</p>
              ) : ""}
              <p className="score" style={{ width: shares !== undefined ? '33%' : '50%' }}>{result.sessionData && this.setDisplayScore(result)}</p>
            </ResultDivStyle >
          )
        }
      });
    } else {
      if (!tournamentId) {
        resultDivs = (
          <div style={resultDivStyle}>
            Join Tournament to be in leaderboards!
          </div>
        )
      } else {
        resultDivs = shares.map((share, idx) => {
          let place = <p className="place">{idx + 1}</p>;
          let trophy = <p className="trophy">{this.setTrophy(idx, shares)}</p>;
          let shareETH = <p className="share">{(parseInt(web3.utils.fromWei(tournament.pool)) * parseInt(share) / 100)} ETH</p>
          return (
            <SharesText key={idx}>{place}{trophy}{shareETH}</SharesText>
          )
        })
      }
    }

    const button = () => {
      if (accountBuyIn > 0 && playerAddress && accountValidated) {
        return (
          <JoinTourneyBtn
            onClick={this.handleJoinClick}
            mainColor={"#06df9b"}
            disabled={gameNo === tournament.maxTries ? "disabled" : ""}
          >
            {`Play ( ${typeof gameNo !== "number" ? 0 : gameNo} out of ${tournament.maxTries} )`}
          </JoinTourneyBtn>
        )
      } else {
        return (<JoinTourneyBtn
          onClick={playerAddress && accountValidated ? this.handleOpenBuyinModal : this.handleOpenJoinModal}
          mainColor={"#06df9b"}
        >
          {`Join ( ${tournament.buyInAmount && web3.utils.fromWei(tournament.buyInAmount.toString())} ETH )`}
        </JoinTourneyBtn>)
      }
    }

    return (
      <>
        <div style={widgetStyle}>
          {!!tournament ? (
            <>
              <Modal show={isReplayModalOpen} toggleModal={this.handleReplayModal}>
                <PlayerGameReplays hash={currentFileHash} />
              </Modal>
              <div style={tournamentInfoStyle}>
                {tournament.gameStage ? (
                  <span style={tourneyTitleStyle}>{tournament.gameStage}</span>
                ) : (
                    <span style={tourneyTitleStyle}>{this.formatTourneyTitle(tournament)}</span>
                  )
                }
                <span style={tourneyTitleInfo}>{this.formatTourneyTimeInfo(tournament)}</span>
                <span style={tourneyTitleInfo}>Status: {this.getStatus(tournament)}</span>
              </div>
              <div style={leaderBoardStyle}>
                <h1 style={titleHeader}>Leaderboard</h1>
                <div style={resultDivsStyle}>
                  {resultDivs}
                </div>
              </div>
              <JoinPromptModal
                isOpen={isJoinModalOpen}
                handleCloseModal={this.handleCloseJoinModal}
                connectAndValidateAccount={connectAndValidateAccount}
                account={playerAddress}
                accountValidated={accountValidated}
                modalText={"You must be logged in to join a tournament"}
              />
              <BuyinPromptModal
                isOpen={isBuyinModalOpen}
                handleCloseBuyinModal={this.handleCloseBuyinModal}
                handleJoinClick={this.handleJoinClick}
                drizzle={drizzle}
                tournamentId={tournament.id}
                tournamentBuyInAmount={tournament.buyInAmount}
                maxTries={tournament.maxTries}
                address={playerAddress}
              />
              {tournamentId === undefined ? (
                button()
              ) : (
                  <div style={totalBuyIn} >
                    <span>Total Buy-in Pool</span>
                    <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{tournament.pool && web3.utils.fromWei((tournament.pool).toString())} ETH</span>
                  </div>
                )}
            </>
          ) : (
              <div style={tournamentInfoStyle}>
                <span style={tourneyTitleStyle}>No Tournaments</span>
              </div>
            )}
        </div>
      </>
    )
  }
}

const widgetStyle: CSS.Properties = {
  width: '100%',
  height: '100%',
  // padding: '0.8rem 1rem',
  justifyContent: 'center',
}

const leaderBoardStyle: CSS.Properties = {
  width: '100%',
  padding: '0.8rem 1rem',
  display: 'flex',
  flexDirection: 'column',
  margin: '0 0 0.512rem 0',
  background: `rgb(${baseColors.white})`,
  boxShadow: shadows.soft,
  justifyContent: 'center',
  // borderRadius: '7px 7px 0 0'
}

const divLoadingStyle: CSS.Properties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
}

const titleHeader: CSS.Properties = {
  textTransform: 'uppercase',
  fontFamily: fonts.family.ApercuBold,
  margin: '1rem auto',
  fontSize: fonts.size.h4,
  fontWeight: fonts.weight.medium,
  color: `rgb(${baseColors.dark})`
}

const resultDivsStyle: CSS.Properties = {
  width: '100%',
  padding: '0',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center'
}

const resultDivStyle: CSS.Properties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  margin: '0 0 1rem 0',
  padding: '0.3rem 0.5rem'
}

const playerAddressStyle: CSS.Properties = {
  fontSize: fonts.size.medium,
  color: `rgb(${baseColors.dark})`,
  fontFamily: fonts.family.ApercuBold,
  marginRight: '0.2rem'
}

const timeLeftStyle: CSS.Properties = {
  fontSize: fonts.size.medium,
  color: `#0093d5`,
  fontFamily: fonts.family.ApercuBold,
  marginLeft: '0.2rem'
}

const tournamentInfoStyle: CSS.Properties = {
  width: '100%',
  background: `#ffb600`,
  padding: '0.9rem',
  display: 'flex',
  flexDirection: 'column',
  boxShadow: shadows.soft,
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: '7px 7px 0 0'
}

const tourneyTitleStyle: CSS.Properties = {
  fontSize: fonts.size.h5,
  fontFamily: fonts.family.ApercuBold,
  color: `rgb(${baseColors.dark})`,
  margin: '5px'
}

const tourneyTitleInfo: CSS.Properties = {
  fontSize: fonts.size.medium,
  fontFamily: fonts.family.ApercuLight,
  color: `rgb(${baseColors.dark})`
}

const joinTourneyBtn: CSS.Properties = {
  fontSize: fonts.size.medium,
  fontFamily: fonts.family.ApercuBold,
  color: `rgb(${baseColors.dark})`,
  background: `#06df9b`,
  padding: '1rem 0.9rem',
  width: '100%',
  cursor: 'pointer',
  outline: 'none',
  border: 'none',
  borderRadius: '7px',
  textTransform: 'uppercase',
}

const totalBuyIn: CSS.Properties = {
  fontSize: fonts.size.medium,
  fontFamily: fonts.family.ApercuBold,
  color: `rgb(${baseColors.dark})`,
  background: `#06df9b`,
  padding: '1rem 0.9rem',
  width: '100%',
  outline: 'none',
  border: 'none',
  borderRadius: '7px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  flexDirection: 'column',
}

export default TournamentResultsCard