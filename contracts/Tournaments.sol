pragma solidity ^0.6.4;

import "@openzeppelin/contracts/access/Ownable.sol";

contract Tournaments is Ownable {
  /**
  `Data
  */
  enum TournamentState {
    Draft,
    Active,
    Ended
  }

  struct Tournament {
    address payable organizer;
    uint            endTime;
    string          data;
    uint            prize;
    uint            maxTries;
    TournamentState state;
    uint            balance;
  }

  struct GameResult {
    bool            winner;
    address payable player;
    string          data;
  }

  Tournament[] public tournaments;
  mapping(uint => GameResult[]) public results;
  mapping(uint => mapping (address => uint[])) public resultsPlayerMap;

  /**
    Events
  */
  event TournamentCreated(uint tournamentId);
  event TournamentActivated(uint tournamentId);
  event ResultSubmitted(uint tournamentId, address indexed player,
    uint256 indexed resultId);
  event WinnerDeclared(uint tournamentId, address indexed player, uint256 indexed resultId);
  event TournamentStopped(uint tournamentId);

  /**
    Modifiers
  */
  modifier amountNotZero(uint amount) {
    require(amount != 0, "Amount must not be zero");
    _;
  }

  modifier noTournamentsOverflow(){
    require((tournaments.length + 1) > tournaments.length,
      "Too many tournaments");
    _;
  }

  modifier noResultsOverflow(uint tournamentId){
    require((results[tournamentId].length + 1) > results[tournamentId].length,
      "Too many results");
    _;
  }

  modifier notInPast(uint time) {
    require(time > now, "Incorrect time");
    _;
  }

  modifier tournamentIdIsCorrect(uint id){
    require(id < tournaments.length, "Incorrect tournament id");
    _;
  }

  modifier resultIdIsCorrect(uint tournamentId, uint resultId) {
    require(resultId < results[tournamentId].length, "Incorrect result Id");
    _;
  }

  modifier tournamentNotEnded(uint id) {
    require(now < tournaments[id].endTime, "Tournament has ended");
    _;
  }

  modifier enoughTriesLeft(uint id, address user) {
    require(tournaments[id].maxTries < resultsPlayerMap[id][user].length, "Max tries reached");
    _;
  }

  modifier onlyOrganizer(uint tournamentId) {
    require(msg.sender == tournaments[tournamentId].organizer,
      "Must be tournament's organizer");
    _;
  }

  modifier notOrganizer(uint tournamentId) {
    require(msg.sender != tournaments[tournamentId].organizer,
      "Must not be tournament's organizer");
    _;
  }

  modifier correctPaymentAmount(uint amount) {
    require((amount * 1 wei) == msg.value,
      "Incorrent payment amount");
    _;
  }

  modifier correctTournamentState(uint tournamentId, TournamentState state) {
    require(tournaments[tournamentId].state == state,
      "Incorrect tournament state");
    _;
  }

  modifier resultIsNotWinner(uint tournamentId, uint resultId) {
    require(results[tournamentId][resultId].winner == false,
      "Result is already winner");
    _;
  }

  modifier enoughBalanceForPrize(uint tournamentId) {
    require(tournaments[tournamentId].balance >= tournaments[tournamentId].prize,
      "Not enough tournament balance");
    _;
  }

  /**
    Methods
  */
  function createTournament(
    address payable organizer,
    uint            endTime,
    string calldata data,
    uint256         prize,
    uint            maxTries
  )
    external
    notInPast(endTime)
    amountNotZero(prize)
    noTournamentsOverflow()
    returns (uint)
  {
    tournaments.push(Tournament(organizer, endTime, data, prize,
      maxTries, TournamentState.Draft, 0));
    emit TournamentCreated(tournaments.length - 1);
    return (tournaments.length - 1);
  }

  function activateTournament(uint tournamentId, uint value)
    external
    payable
    tournamentIdIsCorrect(tournamentId)
    tournamentNotEnded(tournamentId)
    onlyOrganizer(tournamentId)
    correctPaymentAmount(value)
    correctTournamentState(tournamentId, TournamentState.Draft)
  {
      tournaments[tournamentId].balance += value;
      require (tournaments[tournamentId].balance >= tournaments[tournamentId].prize,
        "Payment amount is lower than prize");
      tournaments[tournamentId].state = TournamentState.Active;
      emit TournamentActivated(tournamentId);
  }

  function submitResult(uint tournamentId, string calldata data)
    external
    tournamentIdIsCorrect(tournamentId)
    noResultsOverflow(tournamentId)
    correctTournamentState(tournamentId, TournamentState.Active)
    tournamentNotEnded(tournamentId)
    notOrganizer(tournamentId)
    enoughTriesLeft(tournamentId, msg.sender)
  {
    results[tournamentId].push(GameResult(false, msg.sender, data));
    uint resultId = results[tournamentId].length - 1;
    resultsPlayerMap[tournamentId][msg.sender].push(resultId);
    emit ResultSubmitted(tournamentId, msg.sender, resultId);
  }

  function declareWinner(uint tournamentId, uint resultId)
    external
    tournamentIdIsCorrect(tournamentId)
    resultIdIsCorrect(tournamentId, resultId)
    onlyOrganizer(tournamentId)
    correctTournamentState(tournamentId, TournamentState.Active)
    resultIsNotWinner(tournamentId, resultId)
    enoughBalanceForPrize(tournamentId)
  {
      results[tournamentId][resultId].winner = true;
      results[tournamentId][resultId].player.transfer(tournaments[tournamentId].prize);
      tournaments[tournamentId].balance -= tournaments[tournamentId].prize;
      emit WinnerDeclared(tournamentId, msg.sender, resultId);
  }

  function stopTournament(uint tournamentId)
    external
    tournamentIdIsCorrect(tournamentId)
    onlyOrganizer(tournamentId)
    correctTournamentState(tournamentId, TournamentState.Active)
  {
    tournaments[tournamentId].state = TournamentState.Ended;
    uint oldBalance = tournaments[tournamentId].balance;
    tournaments[tournamentId].balance = 0;
    if (oldBalance > 0){
      tournaments[tournamentId].organizer.transfer(oldBalance);
    }
    emit TournamentStopped(tournamentId);
  }

  function getTournament(uint tournamentId)
    public
    view
    tournamentIdIsCorrect(tournamentId)
    returns (address, uint, uint, uint, uint)
  {
    return (tournaments[tournamentId].organizer,
      tournaments[tournamentId].endTime,
      tournaments[tournamentId].prize,
      uint(tournaments[tournamentId].state),
      tournaments[tournamentId].balance);
  }

  function getResult(uint tournamentId, uint resultId)
    public
    view
    tournamentIdIsCorrect(tournamentId)
    resultIdIsCorrect(tournamentId, resultId)
    returns (bool, address, string memory)
  {
    return (results[tournamentId][resultId].winner,
      results[tournamentId][resultId].player,
      results[tournamentId][resultId].data);
  }

  function getTournamentsCount()
    public
    view
    returns (uint)
  {
    return tournaments.length;
  }

  function getResultsCount(uint tournamentId)
    public
    view
    tournamentIdIsCorrect(tournamentId)
    returns (uint)
  {
    return results[tournamentId].length;
  }


}
