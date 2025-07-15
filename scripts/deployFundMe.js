// import ethers.js
// create main function
// excute main function

const { ethers } = require("hardhat");
const { LOCK_TIME } = require("../helper-hardhat-config");
async function main() {
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

  if (hre.network.config.chainId == 11155111 && process.env.ETHERSCAN_API_KEY) {
    console.log("waiting for 5 confirmations");
    await fundMe.deploymentTransaction().wait(5);

    await verifyFundMe(fundMe.target, [LOCK_TIME]);
  } else {
    console.log("verification skipped..");
  }

  // 验证流程
  // 1. init 2 accounts
  const [firstAccount, secondAccount] = await ethers.getSigners();

  // fund contract with first account
  const fundTx = await fundMe.fund({ value: ethers.parseEther("0.1") });
  await fundTx.wait();

  // check balance of contract
  const balanceOfContract = await ethers.provider.getBalance(fundMe.target);
  console.log(`Balance of the contract id ${balanceOfContract}`);

  // fund contract with second accound
  const fundtTxWithSecAmoun = await fundMe
    .connect(secondAccount)
    .fund({ value: ethers.parseEther("0.1") });
  await fundtTxWithSecAmoun.wait();

  // check balance of contract
  const balanceOfContractAfterSecFund = await ethers.provider.getBalance(
    fundMe.target
  );
  console.log(`Blance of the contract is ${balanceOfContractAfterSecFund}`);

  // check mapping funderToAmount
  const firstAccountBlanceInFundme = await fundMe.funderToAmount(
    firstAccount.address
  );
  const secondAccountBlanceInFundme = await fundMe.funderToAmount(
    secondAccount.address
  );
  console.log(
    `Balance of first account ${firstAccount.address} is ${firstAccountBlanceInFundme}`
  );
  console.log(
    `Balance of first account ${secondAccount.address} is ${secondAccountBlanceInFundme}`
  );
}

async function verifyFundMe(fundMeAddr, args) {
  // 通过hardhat验证
  await hre.run("verify:verify", {
    address: fundMeAddr,
    constructorArguments: args,
  });
}

main()
  .then()
  .catch((err) => {
    console.error(err);
    process.exit(0); // 退出进程
  });
