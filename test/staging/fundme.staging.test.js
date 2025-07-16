const { ethers, deployments } = require("hardhat");
const { assert, expect } = require("chai");
// const helpers = require("@nomicfoundation/hardhat-network-helpers");
const { developmentChains } = require("../../helper-hardhat-config");
// 集成测试，上线之前部署到网络中的测试由于网络各种原因是否能正常运行

developmentChains.includes(network.name)
  ? describe.skip
  : describe("test fundme contract", async function () {
      // beforeEach 每个节点运行的时候都会执行一次
      let fundMe;
      let firstAccount;

      beforeEach(async function () {
        await deployments.fixture(["all"]);
        firstAccount = (await getNamedAccounts()).firstAccount;
        const fundMeDeployment = await deployments.get("FundMe");
        fundMe = await ethers.getContractAt("FundMe", fundMeDeployment.address);
      });
      // test fund and getFund successfully
      it("fund and getFund successfully", async function () {
        // make sure target reached
        await fundMe.fund({ value: ethers.parseEther("0.1") }); // 3000 * 0.1 = 300
        // make sure window closed
        await new Promise((resolve) => setTimeout(resolve, 181 * 1000));
        // make sure we can get receipt
        const getFundTx = await fundMe.getFund();
        const getFundReceipt = await getFundTx.wait();
        expect(getFundReceipt)
          .to.be.emit(fundMe, "FundWithdrawByOwner")
          .withArgs(ethers.parseEther("0.1"));
      });
      // test fund and refund successfully
      it("fund and refund successfully", async function () {
        // make sure target not reached
        await fundMe.fund({ value: ethers.parseEther("0.005") }); // 3000 * 0.1 = 300
        // make sure window closed
        await new Promise((resolve) => setTimeout(resolve, 181 * 1000));
        // make sure we can get receipt
        const refundTx = await fundMe.refund();
        const refundReceipt = await refundTx.wait();
        expect(refundReceipt)
          .to.be.emit(fundMe, "RefundByFunder")
          .withArgs(firstAccount, ethers.parseEther("0.005"));
      });
    });
