var Token = artifacts.require('./Token.sol')
let gasPrice = 1000000000 // 1GWEI

let _ = '        '

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