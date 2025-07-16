const { DECIMAL, INITIAL_ANSWER } = require("../helper-hardhat-config");
const { developmentChains } = require("../helper-hardhat-config");

module.exports = async ({ getNamedAccounts, deployments }) => {
  if (developmentChains.includes(network.name)) {
    // 本地环境再部署
    const { firstAccount } = await getNamedAccounts();
    const { deploy } = deployments;

    await deploy("MockV3Aggregator", {
      from: firstAccount,
      args: [DECIMAL, INITIAL_ANSWER], // 募资截止时间，单位是秒
      log: true, // 打印部署日志
    });
  } else {
    console.log(
      "environment is not local,mock contract deployment is skipped..."
    );
  }
};

module.exports.tags = ["all", "mock"];
