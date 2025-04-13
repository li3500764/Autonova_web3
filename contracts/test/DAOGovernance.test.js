const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("DAOGovernance 前端集成测试", function () {
  let dao;
  let owner, manager, citizens;

  before(async () => {
    [owner, manager, ...citizens] = await ethers.getSigners();
    const DAOGovernance = await ethers.getContractFactory("DAOGovernance");
    dao = await DAOGovernance.deploy();
    
    // 初始化测试数据
    await dao.addManager(manager.address);
    for (let i = 0; i < 5; i++) {
      await dao.connect(citizens[i]).joinDAO();
    }
  });

  it("应正确获取提案总数和列表", async () => {
    // 创建3个测试提案
    await dao.connect(manager).createProposal("升级智能合约", "将合约升级到V2版本");
    await dao.connect(manager).createProposal("社区活动", "组织线下见面会");
    await dao.connect(manager).createProposal("资金分配", "拨付100ETH用于开发");

    // 获取提案总数
    const totalProposals = await dao.proposalCount();
    console.log('总提案数:', totalProposals.toString());

    // 获取成员总数用于计算通过率
    const totalMembers = await dao.memberCount();

    // 遍历所有提案
    console.log('\n=== 提案列表 ===');
    for (let i = 0; i < totalProposals; i++) {
      const proposal = await dao.getProposal(i);
      
      // 模拟投票（前3个成员赞成）
      for (let j = 0; j < 3; j++) {
        await dao.connect(citizens[j]).vote(i, true);
      }

      // 计算通过率
      const passRate = (Number(proposal.yesVotes) / Number(totalMembers) * 100).toFixed(2);
      
      console.log(
        `[提案#${i}] ${proposal.title}\n` +
        `内容: ${proposal.content.substring(0, 30)}...\n` +
        `通过率: ${passRate}% (${proposal.yesVotes}/${totalMembers})\n` +
        `状态: ${proposal.executed ? '已执行' : '投票中'}\n` +
        '------------------------'
      );
    }
  });
});