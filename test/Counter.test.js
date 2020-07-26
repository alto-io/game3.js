var Counter = artifacts.require('./Counter.sol')
var Tournaments = artifacts.require('./Tournaments.sol')

contract('Counter & Tournaments', accounts => { //moved them to a single file to fix weird ganache nonce issue
 
    let instance;
    beforeEach(async () => {
        instance = await Counter.new();
        tourneyInstance = await Tournaments.new();
    });


    it("tournament creation return a tournament id", () =>
        tourneyInstance.createTournament(accounts[0], Date.now(), "TEST", 3)
        .then(tx => {

            assert.notEqual(
                tx.logs[0].args.tournamentId,
                undefined,
                "tourney creation returns undefined"
            )
        })
    )

    it("Counter is 0", () =>
        instance.getCounter.call()
        .then(counter => {
            assert.equal(counter, 0, "counter is non-zero")
            }
        )
    )

    it("Counter increments when incrementCounter is called", () =>
        instance => instance.incrementCounter.call()
        .then(counter => {
            assert.equal(counter, 1, "counter is not 1")
            }
        )
    )

    it("Counter decrements when decrementCounter is called", () =>
        instance => instance.decrementCounter.call()
        .then(counter => {
            assert.equal(counter, 0, "counter did not go back to 0")
            }
        )
    )

})