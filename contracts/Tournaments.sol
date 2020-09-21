pragma solidity ^0.6.4;

import "@openzeppelin/contracts/access/Ownable.sol";

contract Tournaments is Ownable {
  /**
  `Data
  */
  enum TournamentState {
    Draft,
    Active,
    Ended,
    WinnersDeclared
  }

  struct Tournament {
    address payable organizer;
    uint            endTime;
    string          data;
    uint            prize;
    uint            buyInAmount;
    uint            triesPerBuyIn;
    TournamentState state;
    uint            balance;
    uint[]          shares;
  }

  struct GameResult {
    uint            winner;
    address payable player;
    string          data;
  }

  Tournament[] public tournaments;
  // tournamentId => _
  mapping(uint => GameResult[]) public results;
  mapping(uint => uint[]) public winnerShares;
  mapping(uint => uint) public totalShares;

  // tournamentId => (player => GameResultId[]) - all Player's results for TournamentId
  mapping(uint => mapping (address => uint[])) public resultsPlayerMap;
  // tournamentId => (player => total buy in)
  mapping(uint => mapping (address => uint)) public buyIn;

  /**
    Events
  */
  event TournamentCreated(uint tournamentId);
  event TournamentActivated(uint tournamentId);
  event TournamentNewBuyIn(uint tournamentId);
  event ResultSubmitted(uint tournamentId, address indexed player,
    uint256 indexed resultId);
  event WinnersDeclared(uint tournamentId, uint256[] resultId);
  event WinnersDeclaredByAddress(uint tournamentId, address payable[] resultId);
  event PrizeTransfered(uint tournamentId, uint256 resultId, address indexed player, uint256 amount);
  event TournamentStopped(uint tournamentId);

  /**
    Modifiers
  */
  
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
    require(getTriesLeft(id, user) > 0, "Max tries reached");
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

  modifier correctBuyInAmount(uint tournamentId) {
    require((tournaments[tournamentId].buyInAmount * 1 wei) == msg.value,
      "Incorrent buy in amount");
    _;
  }

  modifier correctTournamentState(uint tournamentId, TournamentState state) {
    require(tournaments[tournamentId].state == state,
      "Incorrect tournament state");
    _;
  }

  modifier resultIsNotWinner(uint tournamentId, uint resultId) {
    require(results[tournamentId][resultId].winner == 0,
      "Result is already winner");
    _;
  }

  modifier resultIsWinner(uint tournamentId, uint resultId) {
    require(results[tournamentId][resultId].winner >= 1,
      "Result is not a winner");
    _;
  }

  modifier correctWinnersCount(uint tournamentId, uint[] memory resultIds) {
    require(winnerShares[tournamentId].length == resultIds.length,
      "Winners count must be equal to shares count");
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
    address payable     organizer,
    string calldata     data,
    uint                endTime,
    uint256[] calldata  shares,
    uint256[] calldata  uintParams,
    uint                value
  )
    external
    payable
    notInPast(endTime)
    noTournamentsOverflow()
    correctPaymentAmount(value)
    returns (uint)
  {
    // uintParams[0] = prize
    // uintParams[1] = buyInAmount
    // uintParams[2] = triesPerBuyIn

    require(uintParams[0] != 0, "Prize must not be zero");
    require(uintParams[1] != 0, "Buy in amount must not be zero");
    require(uintParams[2] != 0, "Tries count must not be zero");

    // check and claulate shares
    uint sharesCount = shares.length;
    require(sharesCount >= 1, "Must have at least one share");
    for (uint i = 0; i < sharesCount; i++) {
      require((shares[i]) > 0, "Must not have zero shares");
      totalShares[tournaments.length - 1] += shares[i];
    }

    tournaments.push(Tournament(organizer, endTime, data, uintParams[0],
      uintParams[1], uintParams[2], TournamentState.Draft, 0, shares));

    winnerShares[tournaments.length - 1] = shares;
    
    // activate tournament
    tournaments[tournaments.length - 1].balance += value;
    require (tournaments[tournaments.length - 1].balance >= tournaments[tournaments.length - 1].prize,
      "Payment amount is lower than prize");
    tournaments[tournaments.length - 1].state = TournamentState.Active;

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

  function payBuyIn(uint tournamentId, uint value)
    external
    payable
    tournamentIdIsCorrect(tournamentId)
    tournamentNotEnded(tournamentId)
    // notOrganizer(tournamentId)
    correctTournamentState(tournamentId, TournamentState.Active)
    correctPaymentAmount(value)
    correctBuyInAmount(tournamentId)
  {
    buyIn[tournamentId][msg.sender] += value;
    tournaments[tournamentId].balance += value;
    emit TournamentNewBuyIn(tournamentId);
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
    results[tournamentId].push(GameResult(0, msg.sender, data));
    uint resultId = results[tournamentId].length - 1;
    resultsPlayerMap[tournamentId][msg.sender].push(resultId);
    emit ResultSubmitted(tournamentId, msg.sender, resultId);
  }

  // temp placeholder function, remove once payout client side is implemented
  function declareWinnersByPlayerId(uint tournamentId, address payable[] calldata playerIds)
    external
    tournamentIdIsCorrect(tournamentId)
    onlyOrganizer(tournamentId)
  {
    require((tournaments[tournamentId].state == TournamentState.Active) || 
      (tournaments[tournamentId].state == TournamentState.Ended),
      "Incorrect tournament state");

    uint resultCount = playerIds.length;
    uint totalSentAmount = 0;
    for (uint i = 0; i < resultCount; i++) {

      // send result
      uint amount = calcPrizeShareByIndex(tournamentId, i);
      playerIds[i].transfer(amount);
      // need to keep total balance unchanged while calculating prize shares
      totalSentAmount += amount;
      // resultid is unused (2nd parameter)
      emit PrizeTransfered(tournamentId, 0, playerIds[i], amount);
    }
    tournaments[tournamentId].balance -= totalSentAmount;

    tournaments[tournamentId].state = TournamentState.WinnersDeclared;
    emit WinnersDeclaredByAddress(tournamentId, playerIds);
  }


  function calcPrizeShareByIndex(uint tournamentId, uint place)
    public
    view
    returns (uint)
  {
    return tournaments[tournamentId].balance *
      winnerShares[tournamentId][place] / totalShares[tournamentId];
  }


  function declareWinners(uint tournamentId, uint[] calldata resultIds)
    external
    tournamentIdIsCorrect(tournamentId)
    onlyOrganizer(tournamentId)
    correctWinnersCount(tournamentId, resultIds)
  {
    require((tournaments[tournamentId].state == TournamentState.Active) || 
      (tournaments[tournamentId].state == TournamentState.Ended),
      "Incorrect tournament state");

    uint resultCount = resultIds.length;
    uint totalSentAmount = 0;
    for (uint i = 0; i < resultCount; i++) {
      require(resultIds[i] < results[tournamentId].length, "Incorrect result Id");
      require(results[tournamentId][resultIds[i]].winner == 0, "Result is already a winner");

      results[tournamentId][resultIds[i]].winner = i + 1;

      // send result
      uint amount = calcPrizeShare(tournamentId, resultIds[i]);
      results[tournamentId][resultIds[i]].player.transfer(amount);
      // need to keep total balance unchanged while calculating prize shares
      totalSentAmount += amount;
      emit PrizeTransfered(tournamentId, resultIds[i], results[tournamentId][resultIds[i]].player, amount);
    }
    tournaments[tournamentId].balance -= totalSentAmount;

    tournaments[tournamentId].state = TournamentState.WinnersDeclared;
    emit WinnersDeclared(tournamentId, resultIds);
  }

  function cancelTournament(uint tournamentId)
    external
    tournamentIdIsCorrect(tournamentId)
    onlyOrganizer(tournamentId)
    correctTournamentState(tournamentId, TournamentState.Active)
  {
    tournaments[tournamentId].state = TournamentState.Ended;

    /* TODO return prize and buyIns
    uint oldBalance = tournaments[tournamentId].balance;
    tournaments[tournamentId].balance = 0;
    if (oldBalance > 0){
      tournaments[tournamentId].organizer.transfer(oldBalance);
    }
    */
    emit TournamentStopped(tournamentId);
  }

  function getTournament(uint tournamentId)
    public
    view
    tournamentIdIsCorrect(tournamentId)
    returns (address, uint, uint, uint, uint, string memory)
  {
    return (tournaments[tournamentId].organizer,
      tournaments[tournamentId].endTime,
      tournaments[tournamentId].prize,
      uint(tournaments[tournamentId].state),
      tournaments[tournamentId].balance,
      tournaments[tournamentId].data);
  }

  function getResult(uint tournamentId, uint resultId)
    public
    view
    tournamentIdIsCorrect(tournamentId)
    resultIdIsCorrect(tournamentId, resultId)
    returns (uint, address, string memory)
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

  function calcPrizeShare(uint tournamentId, uint resultId)
    public
    view
    returns (uint)
  {
    uint place = results[tournamentId][resultId].winner - 1;
    return tournaments[tournamentId].balance *
      winnerShares[tournamentId][place] / totalShares[tournamentId];
  }

  function getTriesLeft(uint tournamentId, address player)
    public
    view
    returns (uint)
  {
    return (tournaments[tournamentId].triesPerBuyIn * buyIn[tournamentId][player] / 
      tournaments[tournamentId].buyInAmount) - resultsPlayerMap[tournamentId][player].length;
  }

  function getBuyIn(uint tournamentId)
    public
    view
    tournamentIdIsCorrect(tournamentId)
    returns (uint) 
  {
    return tournaments[tournamentId].buyInAmount;
  }

  function getMaxTries(uint tournamentId)
    public
    view
    tournamentIdIsCorrect(tournamentId)
    returns (uint)
  {
    return tournaments[tournamentId].triesPerBuyIn;
  }

  function getShares(uint tournamentId)
    public
    view
    tournamentIdIsCorrect(tournamentId)
    returns (uint256[] memory)
  {
    return tournaments[tournamentId].shares;
  }
}
