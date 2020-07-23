var CryptoPizza = artifacts.require("./CryptoPizza.sol");
var Token = artifacts.require("./Token.sol");

let _ = "        ";

module.exports = (deployer, helper, accounts) => {
  deployer.then(async () => {
    try {

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


    } catch (error) {
      console.log(error);
    }
  });
};
