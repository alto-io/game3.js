import React, { Component } from 'react';
import { navigate } from '@reach/router';
import { Button } from 'rimble-ui';
import styled from 'styled-components';

import SkeletonLeaderboardLoader from './SkeletonLeaderboardLoader';
import Modal from './Modal';
import PlayerGameReplays from './PlayerGameReplays';

import { getTournamentResult } from '../helpers/database'
import shortenAddress from "../core/utilities/shortenAddress";
import { Constants } from '@game3js/common';
import web3 from 'web3';
import { format } from 'date-fns';

import {
  TOURNAMENT_STATES,
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

// Container for individual results
const ResultStyle = styled.div`
 display: flex;
 justify-content: space-between;
 align-items: center;
 font-family: 'Apercu Pro Mono';
 font-size: 0.78rem;
 letter-spacing: 0.1px;
 padding: 0.5rem;
 cursor: pointer;
 background: ${props => props.mydata ? "#c4c4c4" : "none"}

 .address {
   font-weight: bold;
   margin: 0;
 }

 .shares {
  margin-left: 1rem;
  width: 33%;
  text-align: left;
 }

 .score {
   color: #0093d5;
   margin: 0;
   text-align: right;
   width: 33%;
 }
 `

const JoinTourneyBtn = styled(Button)`
  color: #101010;
  font-family: 'Apercu Light';
  font-size: 0.825rem;
  outline: none;
  letter-spacing: 0.4px;
  text-transform: uppercase;
  width: 100%;
 `

const JoinLeaderboardsMsg = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding: 0.5rem;
 `

const WidgetStyle = styled.div`
  color: #101010;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 100%;
  height: 100%;
 `

const LeaderboardStyle = styled.div`
  background: #fff;
  box-shadow: 0 4px 16px rgba(0,0,0,0.2);
  display: flex;
  justify-content: center;
  flex-direction: column;
  margin-bottom: 0.75rem;
  padding: 1rem;
  width: 100%;

  .title-header {
    font-family: 'Apercu Bold';
    margin-bottom: 1rem;
    text-align: center;
    text-transform: uppercase;
  }
 `

//  Used inside <LeaderboardStyle>
const ResultDivsStyle = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  padding: 0;
  width: 100%;
 `

const TournamentInfoStyle = styled.div`
  background: #ffb600;
  border-radius: 7px 7px 0 0;
  box-shadow: 0 4px 16px rgba(0,0,0,0.2);
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding: 1rem;
  width: 100%;

  .tourney-title {
    font-size: 1.5rem;
    font-family: 'Apercu Bold';
    margin: 5px;
  }

  .tourney-title-info {
    font-size: 1rem;
  }
 `

const TotalBuyInContainer = styled.div`
  background: #06df9b;
  border: none;
  border-radius: 7px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  outline: none;
  font-size: 1rem;
  padding: 1rem 0.75rem;
  width: 100%;

  .total-buyin {
    font-family: 'Apercu Bold';
    font-size: 1.5rem;
  }
 `

interface IState {
  results: Array<any>;
  tournament: any;
  shares: Array<any>;
  isLoading: boolean;
  tournamentId?: string;
  isReplayModalOpen: boolean;
  currentFileHash?: string;
}

interface IProps {
  tournamentId: any;
  address: any;
  playerAddress: any;
  drizzle: any;
  accountValidated: any;
  connectAndValidateAccount: any;
  setRoute: any;
}

class TournamentResultsCard extends Component<IProps, IState> {
  constructor(props) {
    super(props)

    this.state = {
      results: [],
      tournament: {},
      isLoading: false,
      shares: [],
      isReplayModalOpen: false,
      currentFileHash: '',
      tournamentId: '',
    }
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
    console.log("REFRESHING RESULTS");
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
              if (el1.sessionData.highScore === 0) return 1;        
              if (el2.sessionData.highScore === 0) return -1;
              return el2.sessionData.highScore - el1.sessionData.highScore;
            case Constants.TOSIOS:
              if (el1.sessionData.currentHighestNumber === 0) return -1;        
              if (el2.sessionData.currentHighestNumber === 0) return 1;
              return el1.sessionData.currentHighestNumber - el2.sessionData.currentHighestNumber
            case Constants.WOM:
              if (el1.sessionData.highScore === 0) return 1;        
              if (el2.sessionData.highScore === 0) return -1;
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
    const { drizzle, playerAddress, accountValidated } = this.props;
    const { tournamentId } = this.state;

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

    raw = await contract.methods.getTournament(tournamentId).call()
    await this.fetchShares(tournamentId);
    let data = this.parseData(raw['5']);
    const gameName = data[0];
    const gameStage = data[1] ? data[1] : undefined;
    const maxTries = await contract.methods.getMaxTries(tournamentId).call();
    const tournamentBuyIn = await contract.methods.getBuyIn(tournamentId).call();

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

    // Get tournament results

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
              if (el1.sessionData.highScore === 0) return 1;
              if (el2.sessionData.highScore === 0) return -1;
              return el2.sessionData.highScore - el1.sessionData.highScore
            case Constants.TOSIOS:
              if (el1.sessionData.currentHighestNumber === 0) return 1;
              if (el2.sessionData.currentHighestNumber === 0) return -1;
              return el1.sessionData.currentHighestNumber - el2.sessionData.currentHighestNumber
            case Constants.WOM:
              if (el1.sessionData.highScore === 0) return 1;
              if (el2.sessionData.highScore === 0) return -1;
              return el1.sessionData.highScore - el2.sessionData.highScore
            default:
              break;
          }
        })
      }
    }

    console.log("RESULTS: sorted", results)

    this.setState({
      results,
      tournament,
      isLoading: false
    })
  }

  getBlockchainInfo = async (props) => {
    const { tournamentId, drizzle } = props

    if (drizzle.contracts.Tournaments) {
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
      })

      await this.getTournamentAndLeaderBoards();
    }
  }

  getStatus(tournament: any) {
    return TOURNAMENT_STATES[tournament.state]
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
    const { setRoute } = this.props;
    setRoute("TournamentView");
    navigate("/");
  }

  setShares = () => {
    const {shares} = this.state;

    
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

  extractHighScore = result => {

    let gameName = result.gameName;

    switch (gameName) {
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
    const { currentFileHash, isReplayModalOpen, results, isLoading, tournament, shares } = this.state;
    const { tournamentId, playerAddress } = this.props;

    if (isLoading) {
      return (
        <SkeletonLeaderboardLoader />
      )
    }

    let resultDivs = null;

    if (results.length > 0) {

      resultDivs = results.map((result, idx) => {
        if (result.sessionData) {
          let isMyData = playerAddress && playerAddress.toLowerCase() === result.playerAddress.toLowerCase();
          return (
            <ResultStyle
              mydata={isMyData}
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
            </ResultStyle>
          )
        }
      });
    } else {
      if (!tournamentId) {
        resultDivs = (
          <JoinLeaderboardsMsg>
            Join Tournament to be in leaderboards!
          </JoinLeaderboardsMsg>
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

    return (
      <>
        <WidgetStyle>
          {!!tournament ? (
            <>
              <TournamentInfoStyle>
                <Modal show={isReplayModalOpen} toggleModal={this.handleReplayModal}>
                  <PlayerGameReplays hash={currentFileHash} />
                </Modal>
                {tournament.gameStage ? (
                  <h5 className="tourney-title">{tournament.gameStage}</h5>
                ) : (
                    <h5 className="tourney-title">{this.formatTourneyTitle(tournament)}</h5>
                  )
                }
                <p className="tourney-title-info">{this.formatTourneyTimeInfo(tournament)}</p>
                <p className="tourney-title-info">Status: {this.getStatus(tournament)}</p>
              </TournamentInfoStyle>

              <LeaderboardStyle>
                <h1 className="title-header">Leaderboard</h1>
                <ResultDivsStyle>
                  {resultDivs}
                </ResultDivsStyle>
              </LeaderboardStyle>

              {tournamentId === undefined ? (
                <JoinTourneyBtn onClick={this.handleJoinClick} mainColor={"#06df9b"}>
                  View Tournaments
                </JoinTourneyBtn>
              ) : (
                  <TotalBuyInContainer>
                    <p>Total Buy-in Pool</p>
                    <h5 className="total-buyin">{tournament.pool && web3.utils.fromWei((tournament.pool).toString())} ETH</h5>
                  </TotalBuyInContainer>
                )}
            </>
          ) : (
              <TournamentInfoStyle>
                <h5 className="tourney-title">No Tournaments</h5>
              </TournamentInfoStyle>
            )}
        </WidgetStyle>
      </>
    )
  }
}

export default TournamentResultsCard;