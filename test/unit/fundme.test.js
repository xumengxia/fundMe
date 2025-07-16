const { ethers, deployments } = require("hardhat");
const { assert, expect } = require("chai");
const helpers = require("@nomicfoundation/hardhat-network-helpers");
const { developmentChains } = require("../../helper-hardhat-config.js");
// 本地单元测试
!developmentChains.includes(network.name)
  ? describe.skip
  : describe("test fundme contract", async function () {
      // beforeEach 每个节点运行的时候都会执行一次
      let fundMe;
      let firstAccount;
      let secondAccount;
      let mockV3Aggregator; // 本地测试喂价
      let fundMeSecondAccount;
      beforeEach(async function () {
        await deployments.fixture(["all"]);
        firstAccount = (await getNamedAccounts()).firstAccount;
        secondAccount = (await getNamedAccounts()).secondAccount;
        const fundMeDeployment = await deployments.get("FundMe");
        mockV3Aggregator = await deployments.get("MockV3Aggregator");
        fundMe = await ethers.getContractAt("FundMe", fundMeDeployment.address);
        fundMeSecondAccount = await ethers.getContract("FundMe", secondAccount);
      });
      it("test if the owner is msg.sender", async function () {
        await fundMe.waitForDeployment();
        assert.equal(await fundMe.owner(), firstAccount);
      });
      it("test if the datafeed is assigned correctly", async function () {
        await fundMe.waitForDeployment();
        assert.equal(
          await fundMe.dataFeed(),
          mockV3Aggregator.address
          // "0x694AA1769357215DE4FAC081bf1f309aDC325306"
        );
      });

      // fund getFund reFund
      // unit test for fund
      // window open, value greater than minimum value, funder balance 有记录
      it("window closed, value grater than minimum, fund failed", async function () {
        // make sure the window is  closed
        await helpers.time.increase(200); // 超过合约时间
        await helpers.mine();
        // value is greater than minimum
        await expect(
          fundMe.fund({ value: ethers.parseEther("0.001") })
        ).to.be.revertedWith("window is closed");
      });

      it("window open, value less than mimumum, fund failed", async function () {
        await expect(
          fundMe.fund({ value: ethers.parseEther("0.0001") })
        ).to.be.revertedWith("Send more ETH");
      });
      it("window open,value is greater than minimum, fund success", async function () {
        await fundMe.fund({ value: ethers.parseEther("0.001") });
        const balance = await fundMe.funderToAmount(firstAccount);
        await expect(balance).to.equal(ethers.parseEther("0.001"));
      });
      // unit rest for getFund
      // onlyOwner windowClosed targetReached
      it("not owner, window closed, target reached , getFound failed", async function () {
        // make sure the target is reached
        await fundMe.fund({ value: ethers.parseEther("0.1") });
        // make sure the window is  closed
        await helpers.time.increase(200); // 超过合约时间
        await helpers.mine();
        await expect(fundMeSecondAccount.getFund()).to.be.revertedWith(
          "this function can only be called by owner"
        );
      });
      it("window open, traget reached, getFund failed", async function () {
        await fundMe.fund({ value: ethers.parseEther("0.1") });
        await expect(fundMe.getFund()).to.be.revertedWith(
          "window is not closed"
        );
      });
      it("window closed, target not reached, getFound failed", async function () {
        await fundMe.fund({ value: ethers.parseEther("0.005") });
        // make sure the window is closed
        await helpers.time.increase(200);
        await helpers.mine();
        await expect(fundMe.getFund()).to.be.revertedWith(
          "Target is not reached"
        );
      });
      it("window closed, target reached,getFund success", async function () {
        await fundMe.fund({ value: ethers.parseEther("0.1") });
        // make sure the window is closed
        await helpers.time.increase(200);
        await helpers.mine();

        await expect(fundMe.getFund())
          .to.emit(fundMe, "FundWithdrawByOwner")
          .withArgs(ethers.parseEther("0.1"));
      });

      // refund
      // windowClosed, target not reached, funder has balance
      it("window open, traget not reached, funder has balance, reFund failed", async function () {
        await fundMe.fund({ value: ethers.parseEther("0.005") });
        await expect(fundMe.refund()).to.be.revertedWith(
          "window is not closed"
        );
      });
      it("window closed, target reach, funder has balance", async function () {
        await fundMe.fund({ value: ethers.parseEther("0.1") });
        // make sure the window is closed
        await helpers.time.increase(200);
        await helpers.mine();
        await expect(fundMe.refund()).to.be.revertedWith("Target is reached");
      });
      it("window closed, target not reach, funder does not has balance", async function () {
        await fundMe.fund({ value: ethers.parseEther("0.005") });
        // make sure the window is closed
        await helpers.time.increase(200);
        await helpers.mine();
        await expect(fundMeSecondAccount.refund()).to.be.revertedWith(
          "there is no fund for you"
        );
      });
      it("window closed, target not reach, funder has balance", async function () {
        await fundMe.fund({ value: ethers.parseEther("0.005") });
        // make sure the window is closed
        await helpers.time.increase(200);
        await helpers.mine();
        await expect(fundMe.refund())
          .to.emit(fundMe, "RefundByFunder")
          .withArgs(firstAccount, ethers.parseEther("0.005"));
      });
    });
