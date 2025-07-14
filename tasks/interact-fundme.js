const { task } = require("hardhat/config");

task("interact-fundme", "interact with fundme contract")
  .addParam("addr", "fundme contract address")
  .setAction(async (taskArgs, hre) => {
    // 创建一个工厂并贴上
    const fundMeFactory = await ethers.getContractFactory("FundMe");
    const fundMe = fundMeFactory.attach(taskArgs.addr);
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
  });
module.exports = {};
