var CryptoPizza = artifacts.require('./CryptoPizza.sol')
let gasPrice = 1000000000 // 1GWEI

let _ = '        '

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