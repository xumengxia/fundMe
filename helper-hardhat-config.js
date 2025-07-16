// 喂价测试数据
const DECIMAL = 8;
const INITIAL_ANSWER = 300000000000; // 初始喂价价格，3000 * 10^8
const developmentChains = ["hardhat", "local"];
const LOCK_TIME = 180; // 锁定时间秒
const CONFIRMATIONS = 5; // confirmations

// 获取sepolia的喂价地址
// https://docs.chain.link/ => Data Feeds => Price Address => Price Feed Addresses =>
// Sepolia Testnet => ETH / USD
// 获取chainId https://chainlist.org/?search=bnb&testnets=true
const networkConfig = {
  11155111: {
    ethUsdDataFeed: "0x694AA1769357215DE4FAC081bf1f309aDC325306",
  },
  97: {
    ethUsdDataFeed: "0x143db3CEEfbdfe5631aDD3E50f7614B6ba708BA7",
  },
};

module.exports = {
  DECIMAL,
  INITIAL_ANSWER,
  developmentChains,
  networkConfig,
  LOCK_TIME,
  CONFIRMATIONS,
};
