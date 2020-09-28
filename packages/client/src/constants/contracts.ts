export const DAI_CONTRACT = {
  1: {
    address: '0x6b175474e89094c44da98b954eedeac495271d0f',
    abi: [
      {
        constant: true,
        inputs: [{ name: 'src', type: 'address' }],
        name: 'balanceOf',
        outputs: [{ name: '', type: 'uint256' }],
        payable: false,
        stateMutability: 'view',
        type: 'function'
      },
      {
        constant: false,
        inputs: [
          { name: 'dst', type: 'address' },
          { name: 'wad', type: 'uint256' }
        ],
        name: 'transfer',
        outputs: [{ name: '', type: 'bool' }],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function'
      }
    ]
  }
}

export const TOURNAMENT_STATE_ACTIVE = 0
export const TOURNAMENT_STATE_ENDED = 1
export const TOURNAMENT_STATE_WINNERS_DECLARED = 2

export const TOURNAMENT_STATES =
[
  "Active",
  "Ended",
  "Winners Declared"
]

export const TOURNAMENT_CONTRACT = {
  4: {
    address: '0x6aD65F62559a717Ab9065C2c2B6945986c206CeA',
    abi: [
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "internalType": "address",
            "name": "previousOwner",
            "type": "address"
          },
          {
            "indexed": true,
            "internalType": "address",
            "name": "newOwner",
            "type": "address"
          }
        ],
        "name": "OwnershipTransferred",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "tournamentId",
            "type": "uint256"
          },
          {
            "indexed": true,
            "internalType": "address",
            "name": "player",
            "type": "address"
          },
          {
            "indexed": true,
            "internalType": "uint256",
            "name": "resultId",
            "type": "uint256"
          }
        ],
        "name": "ResultSubmitted",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "tournamentId",
            "type": "uint256"
          }
        ],
        "name": "TournamentActivated",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "tournamentId",
            "type": "uint256"
          }
        ],
        "name": "TournamentCreated",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "tournamentId",
            "type": "uint256"
          }
        ],
        "name": "TournamentStopped",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "tournamentId",
            "type": "uint256"
          },
          {
            "indexed": true,
            "internalType": "address",
            "name": "player",
            "type": "address"
          },
          {
            "indexed": true,
            "internalType": "uint256",
            "name": "resultId",
            "type": "uint256"
          }
        ],
        "name": "WinnerDeclared",
        "type": "event"
      },
      {
        "inputs": [],
        "name": "owner",
        "outputs": [
          {
            "internalType": "address",
            "name": "",
            "type": "address"
          }
        ],
        "stateMutability": "view",
        "type": "function",
        "constant": true
      },
      {
        "inputs": [],
        "name": "renounceOwnership",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "name": "results",
        "outputs": [
          {
            "internalType": "bool",
            "name": "winner",
            "type": "bool"
          },
          {
            "internalType": "address payable",
            "name": "player",
            "type": "address"
          },
          {
            "internalType": "string",
            "name": "data",
            "type": "string"
          }
        ],
        "stateMutability": "view",
        "type": "function",
        "constant": true
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "name": "tournaments",
        "outputs": [
          {
            "internalType": "address payable",
            "name": "organizer",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "endTime",
            "type": "uint256"
          },
          {
            "internalType": "string",
            "name": "data",
            "type": "string"
          },
          {
            "internalType": "uint256",
            "name": "prize",
            "type": "uint256"
          },
          {
            "internalType": "enum Tournaments.TournamentState",
            "name": "state",
            "type": "uint8"
          },
          {
            "internalType": "uint256",
            "name": "balance",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function",
        "constant": true
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "newOwner",
            "type": "address"
          }
        ],
        "name": "transferOwnership",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address payable",
            "name": "organizer",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "endTime",
            "type": "uint256"
          },
          {
            "internalType": "string",
            "name": "data",
            "type": "string"
          },
          {
            "internalType": "uint256",
            "name": "prize",
            "type": "uint256"
          }
        ],
        "name": "createTournament",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "tournamentId",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "value",
            "type": "uint256"
          }
        ],
        "name": "activateTournament",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function",
        "payable": true
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "tournamentId",
            "type": "uint256"
          },
          {
            "internalType": "string",
            "name": "data",
            "type": "string"
          }
        ],
        "name": "submitResult",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "tournamentId",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "resultId",
            "type": "uint256"
          }
        ],
        "name": "declareWinner",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "tournamentId",
            "type": "uint256"
          }
        ],
        "name": "stopTournament",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "tournamentId",
            "type": "uint256"
          }
        ],
        "name": "getTournament",
        "outputs": [
          {
            "internalType": "address",
            "name": "",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function",
        "constant": true
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "tournamentId",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "resultId",
            "type": "uint256"
          }
        ],
        "name": "getResult",
        "outputs": [
          {
            "internalType": "bool",
            "name": "",
            "type": "bool"
          },
          {
            "internalType": "address",
            "name": "",
            "type": "address"
          },
          {
            "internalType": "string",
            "name": "",
            "type": "string"
          }
        ],
        "stateMutability": "view",
        "type": "function",
        "constant": true
      },
      {
        "inputs": [],
        "name": "getTournamentsCount",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function",
        "constant": true
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "tournamentId",
            "type": "uint256"
          }
        ],
        "name": "getResultsCount",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function",
        "constant": true
      }
    ]
  }
}