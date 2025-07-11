// import ethers.js
// create main function
// excute main function

const { ethers } = require("hardhat")

async function main() {
    // create factory
    const fundMeFactory = await ethers.getContractFactory("FundMe");
    console.log("Contract deploying");
    // deploy contract from factory
    const fundMe = await fundMeFactory.deploy(10);
    // 等待广播完毕
    await fundMe.waitForDeployment();
    console.log(`Contract has been deployed successfully, contract address is ${fundMe.target}`);
}

main().then().catch((err) => {
    console.error(err);
    process.exit(0); // 退出进程
})