var CryptoPizza = artifacts.require("./CryptoPizza.sol");

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

    } catch (error) {
      console.log(error);
    }
  });
};
