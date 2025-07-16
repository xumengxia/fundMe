require("@nomicfoundation/hardhat-toolbox");
// require("dotenv").config();
require("@chainlink/env-enc").config(); // 加密之后的
require("./tasks/index");
require("hardhat-deploy"); // 测试
require("@nomicfoundation/hardhat-ethers");
require("hardhat-deploy");
require("hardhat-deploy-ethers");
const SEPOLIA_URL = process.env.SEPOLIA_URL;
const PRIVATA_KEY = process.env.PRIVATA_KEY; //matemask私钥
const PRIVATA_KEY_2 = process.env.PRIVATA_KEY_2;
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  defaultNetwork: "hardhat", // sepolia
  solidity: "0.8.28",
  mocha: {
    timeout: 400000, // 200秒当前单位毫秒
  },
  networks: {
    sepolia: {
      url: SEPOLIA_URL, // Alchemy Infura QuickNode
      accounts: [PRIVATA_KEY, PRIVATA_KEY_2],
      chainId: 11155111, // Sepolia的链ID
    },
  },
  etherscan: {
    apiKey: {
      sepolia: ETHERSCAN_API_KEY,
    },
  },
  namedAccounts: {
    firstAccount: {
      default: 0, // 这里默认用的是第一个账号
    },
    secondAccount: {
      default: 2, // 对应我第二个账号
    },
  },
};
