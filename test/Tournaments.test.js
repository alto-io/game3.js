var Tournaments = artifacts.require('./Tournaments.sol')
let gasPrice = 1000000000 // 1GWEI

let _ = '        '

contract('Tournaments', accounts => {
    it("tournament creation return a tournament id", () =>
    Tournaments.deployed()
        .then(instance => instance.createTournament(accounts[0], Date.now(), "TEST", 3))
        .then(tx => {

            assert.notEqual(
                tx.logs[0].args.tournamentId,
                undefined,
                "tourney creation returns undefined"
            )
        })
    )
})