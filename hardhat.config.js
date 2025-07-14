require("@nomicfoundation/hardhat-toolbox");
// require("dotenv").config();
require("@chainlink/env-enc").config(); // 加密之后的
const SEPOLIA_URL = process.env.SEPOLIA_URL
const PRIVATA_KEY = process.env.PRIVATA_KEY //matemask私钥
const PRIVATA_KEY_2 = process.env.PRIVATA_KEY_2
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  // defaultNetwork: "hardhat", // sepolia
  solidity: "0.8.28",
  networks: {
    sepolia: {
      url: SEPOLIA_URL, // Alchemy Infura QuickNode
      accounts: [PRIVATA_KEY, PRIVATA_KEY_2],
      chainId: 11155111, // Sepolia的链ID
    }
  },
  etherscan: {
    apiKey: {
      sepolia: ETHERSCAN_API_KEY
    }
  }
};
