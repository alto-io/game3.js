//var CryptoPizza = artifacts.require("./CryptoPizza.sol");
//var Token = artifacts.require("./Token.sol");
var Tournament = artifacts.require("./Tournaments.sol");
//var Counter = artifacts.require("./Counter.sol");
let _ = "        ";

module.exports = (deployer, helper, accounts) => {
  deployer.then(async () => {
    try {
/*
      // Deploy CryptoPizza.sol
      await deployer.deploy(CryptoPizza);
      let cryptoPizza = await CryptoPizza.deployed();
      console.log(
        _ + "CryptoPizza deployed at: " + cryptoPizza.address
      );

      // Deploy Token.sol
      await deployer.deploy(Token);
      let token = await Token.deployed();
      console.log(
        _ + "Token deployed at: " + token.address
      );
*/
      // Deploy Tournament.sol
      await deployer.deploy(Tournament);
      let tournament = await Tournament.deployed();
      console.log(
        _ + "Tournament deployed at: " + tournament.address
      );
/*
      // Deploy Counter.sol
      await deployer.deploy(Counter);
      let counter = await Counter.deployed();
      console.log(
        _ + "Counter deployed at: " + counter.address
      );
      
*/
    } catch (error) {
      console.log(error);
    }
  });
};
