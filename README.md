# Sample Hardhat Project

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, and a Hardhat Ignition module that deploys that contract.

Try running some of the following tasks:

```shell
npx hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat node
npx hardhat ignition deploy ./ignition/modules/Lock.js

```

# 运行脚本

```
--reset 重置部署，重新部署合约
npx hardhat deploy --network sepolia --reset
npx hardhat deploy-fundme --network sepolia
合约交互
npx hardhat interact-fundme --addr 地址 --network sepolia

```

# 测试

```
hardhat-deploy
npm install -D hardhat-deploy
require("hardhat-deploy"); 在hardhat.config.js中添加
npx hardhat deploy --tags mock
```

### 初始化

```
npx hardhat

```

### 编译合约

```
npx hardhat compile

```

### 部署合约

```
npx hardhat run scripts/deployFundMe.js --network sepolia
```

### 提取环境变量

```
npm install --save-dev dotenv
```

### 加密设置

```
npm install --save-dev @chainlink/env-enc

2. 设置密码
npx env-enc set-pw

3.加密
npx env-enc set 键值（SEPOLIA_URL）
输入.env 里面对应的值，进行加密
需要继续添加就输入新的值否则直接enter结束进程

4. 使用hardhat 验证合约
npx hardhat verify --network sepolia DEPLOYED_CONTRACT_ADDRESS "Constructor argument 1"
```
