require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

const SEPOLIA_URL = process.env.SEPOLIA_URL
const PRIVATA_KEY = process.env.PRIVATA_KEY

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  // defaultNetwork: "hardhat", // sepolia
  solidity: "0.8.28",
  networks: {
    sepolia: {
      url: SEPOLIA_URL, // Alchemy Infura QuickNode
      accounts: [PRIVATA_KEY]
    }
  }
};
