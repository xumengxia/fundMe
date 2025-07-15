// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import {AggregatorV3Interface} from "@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";

// 众筹
// 1. 创建一个收款函数
// 2. 记录投资人并且查看
// 3. 达到目标值，生产商可以提款
// 4. 在锁定期内没有达到目标值，投资人在锁定期后可以退款

// 预言机 data feed

// 获取测试网通证
// https://docs.chain.link/data-feeds/price-feeds/addresses?page=1&testnetPage=1
// chainlink 测试网水龙头：https://faucets.chain.link
// Alchemy 测试网水龙头:https://sepoliafaucet.com/
// Infura 测试网水龙头:https://www.infura.io/faucet/sepolia

contract FundMe {
    mapping(address => uint256) public funderToAmount;

    uint256 MINIMUM_VALUE = 1 * 10 ** 18; // wei最小值 此处代表的是usd

    AggregatorV3Interface public dataFeed; // 初始化 喂价

    uint256 constant TRAGET = 50 * 10 ** 18; // constant 常量不可改变

    address public owner; // 合约的所有者

    uint256 deploymentTimestamp; // 合约部署时间

    uint lockTime; // 锁定时间

    address erc20Addr; // 只允许被这个合约进行修改

    bool public getFundSuccess = false;

    constructor(uint _lockTime) {
        // 合约部署得到时候会调用 constructor
        // sepolia testnet
        dataFeed = AggregatorV3Interface(
            0x694AA1769357215DE4FAC081bf1f309aDC325306
        );
        owner = msg.sender; // 当前合约部署的人
        deploymentTimestamp = block.timestamp; // block当前的区块
        lockTime = _lockTime;
    }

    // external 外部可以调用的 payable可收款的 编译部署后按钮为红色
    function fund() external payable {
        // 断言相当于nodejs中的 assert
        // require(condition 条件,'string')
        require(convertEthToUsd(msg.value) >= MINIMUM_VALUE, "Send more ETH");

        // 当前时间 < 合约部署时间 + 锁定时间 报错
        require(
            block.timestamp < deploymentTimestamp + lockTime,
            "window is closed"
        );

        funderToAmount[msg.sender] = msg.value;
    }

    function getChainlinkDataFeedLatestAnswer() public view returns (int) {
        // prettier-ignore
        (
            /* uint80 roundId */,
            int256 answer,
            /*uint256 startedAt*/,
            /*uint256 updatedAt*/,
            /*uint80 answeredInRound*/
        ) = dataFeed.latestRoundData();
        return answer;
    }

    // 转化ETH到USD
    function convertEthToUsd(
        uint256 ethAmount
    ) internal view returns (uint256) {
        uint256 ethPrice = uint256(getChainlinkDataFeedLatestAnswer()); // 得到eth当前的价格
        return (ethAmount * ethPrice) / (10 ** 8);
        // ETH / USD precision = 10 ** 8
        // x / ETH precision = 10 ** 18
    }

    // 修改owner 权限控制
    function transferOwnership(address newOrder) public onlyOwner {
        owner = newOrder;
    }

    function getFund() external windowClosed onlyOwner {
        // address(this).balance 获取当前的合约 balance余额单位是wei
        require(
            convertEthToUsd(address(this).balance) >= TRAGET,
            "Target is not reached"
        );

        // transfer 纯转账 transfer ETH rever if tx failed 转账失败会损失gas费
        // payable(msg.sender).transfer(address(this).balance);

        // send 纯转账
        // bool success = payable(msg.sender).send(address(this).balance);
        // require(success,"tx failed");

        // call 转账+逻辑常用 函数 transfer ETH with data return value of function and bool
        // {bool,result(可以不用写，对应后面括号里面的方法)} = payable(msg.sender).call{value:金额要传的值}（“方法”）
        bool success;
        (success, ) = payable(msg.sender).call{value: address(this).balance}(
            ""
        );
        require(success, "transfer tx failed");
        funderToAmount[msg.sender] = 0;
        getFundSuccess = true;
    }

    // 退款的操作
    function refund() external windowClosed {
        require(
            convertEthToUsd(address(this).balance) < TRAGET,
            "Target is reached"
        );
        require(funderToAmount[msg.sender] != 0, "there is no fund for you");

        bool success;
        (success, ) = payable(msg.sender).call{
            value: funderToAmount[msg.sender]
        }("");
        require(success, "transfer tx failed");
        funderToAmount[msg.sender] = 0; // 找到对应的amount进行退款之后再设置为0防止重复退款
    }

    // 修改交易通证 transfer token
    function setFunderToAmount(
        address funder,
        uint256 amountToUpdate
    ) external {
        require(
            msg.sender == erc20Addr,
            "You do not have permission to call this function"
        );
        funderToAmount[funder] = amountToUpdate;
    }

    // 只允许合约的所有者修改erc20Addr
    function setErc20Addr(address _erc20Addr) public onlyOwner {
        erc20Addr = _erc20Addr;
    }

    //  修改器 针对require的简便写法
    modifier windowClosed() {
        // 当前时间 > 合约部署时间 + 锁定时间 可以取款 否则窗口还没有关闭
        require(
            block.timestamp >= deploymentTimestamp + lockTime,
            "window is not closed"
        );
        _; // 其他操作继续执行
    }

    modifier onlyOwner() {
        require(
            msg.sender == owner,
            "this function can only be called by owner"
        );
        _; // 其他操作继续执行
    }

    // 合约销毁应该把钱退回去；没有写多次生成新的合约之前的钱去哪里了
}
