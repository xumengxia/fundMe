const { task } = require("hardhat/config");
const { LOCK_TIME } = require("../helper-hardhat-config");
task("deploy-fundme", "deploy and verify fundme contract").setAction(
  async (taskArgs, hre) => {
    // create factory
    const fundMeFactory = await ethers.getContractFactory("FundMe");
    console.log("Contract deploying");
    // deploy contract from factory 10 时间短 300/60 = 5min
    const fundMe = await fundMeFactory.deploy(LOCK_TIME);
    // 等待广播完毕
    await fundMe.waitForDeployment();
    console.log(
      `Contract has been deployed successfully, contract address is ${fundMe.target}`
    );

    // 验证合约 verify fundMe 只有部署到sepolia才验证
    // console.log(hre.network.config.chainId, process.env.ETHERSCAN_API_KEY);

    if (
      hre.network.config.chainId == 11155111 &&
      process.env.ETHERSCAN_API_KEY
    ) {
      console.log("waiting for 5 confirmations");
      await fundMe.deploymentTransaction().wait(5);

      await verifyFundMe(fundMe.target, [LOCK_TIME]);
    } else {
      console.log("verification skipped..");
    }
  }
);
async function verifyFundMe(fundMeAddr, args) {
  // 通过hardhat验证
  await hre.run("verify:verify", {
    address: fundMeAddr,
    constructorArguments: args,
  });
}

module.exports = {};
