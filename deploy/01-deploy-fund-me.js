// function deployFunction() {
//   console.log("this is a deploy function");
// }
// module.exports.default = deployFunction;
// module.exports = async (hre) => {
//   // 匿名函数 hre是吧hardhat传入进来
//   console.log("this is a deploy function");
// };
const { network } = require("hardhat");
const {
  developmentChains,
  networkConfig,
  LOCK_TIME,
} = require("../helper-hardhat-config");

// 匿名函数 hre是吧hardhat传入进来
module.exports = async ({ getNamedAccounts, deployments }) => {
  const { firstAccount } = await getNamedAccounts();
  const { deploy } = deployments;

  let dataFeedAddr;
  if (developmentChains.includes(network.name)) {
    // 本地数据使用mock喂价
    const mokeV3Aggregator = await deployments.get("MockV3Aggregator");
    dataFeedAddr = mokeV3Aggregator.address;
  } else {
    // 链上数据使用链上喂价

    dataFeedAddr = networkConfig(network.config.chainId); // 链上喂价合约地址
  }
  await deploy("FundMe", {
    from: firstAccount,
    args: [LOCK_TIME, dataFeedAddr], // LOCK_TIME募资截止时间，单位是秒
    log: true, // 打印部署日志
  });
};

module.exports.tags = ["all", "fundme"];
