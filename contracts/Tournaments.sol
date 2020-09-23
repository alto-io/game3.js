pragma solidity ^0.6.4;

import "@openzeppelin/contracts/access/Ownable.sol";

contract Tournaments is Ownable {
  /**
  `Data
  */
  enum TournamentState {
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

  Tournament[] public tournaments;
  // tournamentId => _
  mapping(uint => uint[]) public winnerShares;
  mapping(uint => uint) public totalShares;

  // tournamentId => (player => total buy in)
  mapping(uint => mapping (address => uint)) public buyIn;

  /**
    Events
  */
  event TournamentCreated(uint tournamentId);
  event TournamentActivated(uint tournamentId);
  event TournamentNewBuyIn(uint tournamentId);
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

  modifier notInPast(uint time) {
    require(time > now, "Incorrect time");
    _;
  }

  modifier tournamentIdIsCorrect(uint id){
    require(id < tournaments.length, "Incorrect tournament id");
    _;
  }

  modifier tournamentNotEnded(uint id) {
    require(now < tournaments[id].endTime, "Tournament has ended");
    _;
  }

  modifier onlyOrganizer(uint tournamentId) {
    require(msg.sender == tournaments[tournamentId].organizer,
      "Must be tournament's organizer");
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

  /**
    Methods
  */
  function createTournament(
    address payable     organizer,
    string calldata     data,
    uint                endTime,
    uint256[] calldata  shares,
    uint256[] calldata  uintParams
  )
    external
    payable
    notInPast(endTime)
    noTournamentsOverflow()
    correctPaymentAmount(uintParams[0])
    returns (uint)
  {
    // uintParams[0] = prize
    // uintParams[1] = buyInAmount
    // uintParams[2] = triesPerBuyIn

    require(uintParams[0] != 0, "Prize must not be zero");
    require(uintParams[1] != 0, "Buy in amount must not be zero");
    require(uintParams[2] != 0, "Tries count must not be zero");

    // check and calculate shares
    uint sharesCount = shares.length;
    require(sharesCount >= 1, "Must have at least one share");
    for (uint i = 0; i < sharesCount; i++) {
      require((shares[i]) > 0, "Must not have zero shares");
      totalShares[tournaments.length - 1] += shares[i];
    }

    // create the tournament with initial balance equal to prize (uintParams[0])
    tournaments.push(Tournament(organizer, endTime, data, uintParams[0],
      uintParams[1], uintParams[2], TournamentState.Active, uintParams[0], shares));

    winnerShares[tournaments.length - 1] = shares;

    emit TournamentCreated(tournaments.length - 1);
    return (tournaments.length - 1);
  }

  function payBuyIn(uint tournamentId, uint value)
    external
    payable
    tournamentIdIsCorrect(tournamentId)
    tournamentNotEnded(tournamentId)
    correctTournamentState(tournamentId, TournamentState.Active)
    correctPaymentAmount(value)
    correctBuyInAmount(tournamentId)
  {
    buyIn[tournamentId][msg.sender] += value;
    tournaments[tournamentId].balance += value;
    emit TournamentNewBuyIn(tournamentId);
  }

  // function sends all the tournament pool to adresses
  function declareWinnersByAddresses(uint tournamentId, address payable[] calldata addresses)
    external
    tournamentIdIsCorrect(tournamentId)
    onlyOrganizer(tournamentId)
  {
    require((tournaments[tournamentId].state == TournamentState.Active) || 
      (tournaments[tournamentId].state == TournamentState.Ended),
      "Incorrect tournament state");

    uint playersCount = addresses.length;
    uint totalSentAmount = 0;
    for (uint i = 0; i < playersCount; i++) {

      // send result
      uint amount = calcPrizeShareByIndex(tournamentId, i);
      addresses[i].transfer(amount);
      // need to keep total balance unchanged while calculating prize shares
      totalSentAmount += amount;
      // resultid is unused (2nd parameter)
      emit PrizeTransfered(tournamentId, 0, addresses[i], amount);
    }
    tournaments[tournamentId].balance -= totalSentAmount;
    tournaments[tournamentId].state = TournamentState.WinnersDeclared;

    emit WinnersDeclaredByAddress(tournamentId, addresses);
  }


  function calcPrizeShareByIndex(uint tournamentId, uint place)
    public
    view
    returns (uint)
  {
    return tournaments[tournamentId].balance *
      winnerShares[tournamentId][place] / totalShares[tournamentId];
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

  function getTournamentsCount()
    public
    view
    returns (uint)
  {
    return tournaments.length;
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
