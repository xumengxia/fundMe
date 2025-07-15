const { DECIMAL, INITIAL_ANSWER } = require("../helper-hardhat-config");
module.exports = async ({ getNamedAccounts, deployments }) => {
  const { firstAccount } = await getNamedAccounts();
  const { deploy } = deployments;

  await deploy("MockV3Aggregator", {
    from: firstAccount,
    args: [DECIMAL, INITIAL_ANSWER], // 募资截止时间，单位是秒
    log: true, // 打印部署日志
  });
};

module.exports.tags = ["all", "mock"];
