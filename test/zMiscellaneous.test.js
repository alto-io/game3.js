var CryptoPizza = artifacts.require('./CryptoPizza.sol')
var Token = artifacts.require('./Token.sol')

contract('CryptoPizza', accounts => {
    it("first account should have 0 balance", () =>
        CryptoPizza.deployed()
        .then(instance => instance.getPizzasByOwner.call(accounts[0]))
        .then(balance => {
            assert.equal(
                balance.valueOf(),
                0,
                "first account had non-zero balance"
            )
        })
    )
})

contract('Token', accounts => {
    it("accounts[0] balance should be 0", () =>
    Token.deployed()
        .then(instance => instance.balances(accounts[0]))
        .then(balance => {
            assert.equal(
                balance.valueOf(),
                0,
                "balance non-zero"
            )
        })
    )
})