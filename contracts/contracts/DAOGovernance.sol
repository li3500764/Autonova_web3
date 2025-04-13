// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/AccessControl.sol";

contract DAOGovernance is AccessControl {
    bytes32 public constant MANAGER_ROLE = keccak256("MANAGER_ROLE");
    bytes32 public constant CITIZEN_ROLE = keccak256("CITIZEN_ROLE");

    // 提案结构体
    struct Proposal {
        address proposer;
        string title; // 新增标题字段
        string content; // 原description改为content
        uint256 createTime;
        uint256 endTime;
        uint256 yesVotes;
        uint256 noVotes;
        uint256 totalVoters;
        bool executed;
        mapping(address => bool) hasVoted; // 只记录是否投票
        mapping(address => bool) voteChoice; // 新增：记录投票选择
    }
    // 内存结构体
    struct ProposalView {
        address proposer;
        string title;
        string content;
        uint256 createTime;
        uint256 endTime;
        uint256 yesVotes;
        uint256 noVotes;
        uint256 totalVoters;
        bool executed;
        address[] voters; // 改为数组形式返回投票人
    }

    // 合约状态
    uint256 public memberCount;
    uint256 public proposalCount;
    uint256 public currentProposalIndex;
    address public communityFund;

    mapping(uint256 => Proposal) public proposals;
    mapping(address => bool) public isMember;

    event NewProposal(
        uint256 indexed proposalId,
        string indexed title, // 添加索引便于按标题过滤
        address indexed proposer,
        string content, // 非索引节省gas
        uint256 endTime
    );
    event Voted(
        uint256 indexed proposalId,
        address indexed voter,
        bool support
    );
    event ProposalExecuted(uint256 indexed proposalId, bool result);
    event MemberJoined(address indexed member);

    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(MANAGER_ROLE, msg.sender);
        communityFund = address(this);
    }

    // 加入DAO
    function joinDAO() external {
        require(!hasRole(CITIZEN_ROLE, msg.sender), "Already member");
        _grantRole(CITIZEN_ROLE, msg.sender);
        isMember[msg.sender] = true;
        memberCount++;
        emit MemberJoined(msg.sender);
    }

    // 提案创建函数
    function createProposal(
        string memory title,
        string memory content
    ) external onlyRole(MANAGER_ROLE) {
        uint256 proposalId = proposalCount++;
        Proposal storage p = proposals[proposalId];

        p.proposer = msg.sender;
        p.title = title;
        p.content = content;
        p.createTime = block.timestamp;
        p.endTime = block.timestamp + 3 days;

        currentProposalIndex = proposalId;
        emit NewProposal(proposalId, title, msg.sender, content, p.endTime);
    }

    // 投票 (仅成员)
    function vote(
        uint256 proposalId,
        bool support
    ) external onlyRole(CITIZEN_ROLE) {
        Proposal storage p = proposals[proposalId];
        require(block.timestamp <= p.endTime, "Voting ended");
        require(!p.hasVoted[msg.sender], "Already voted");

        p.totalVoters++;

        p.hasVoted[msg.sender] = true;
        p.voteChoice[msg.sender] = support;

        if (support) {
            p.yesVotes++;
        } else {
            p.noVotes++;
        }

        emit Voted(proposalId, msg.sender, support);
    }

    // 执行提案 (仅管理者)
    function executeProposal(
        uint256 proposalId
    ) external onlyRole(MANAGER_ROLE) {
        Proposal storage p = proposals[proposalId];
        require(block.timestamp > p.endTime, "Voting not ended");
        require(!p.executed, "Already executed");

        bool passed = (p.yesVotes * 100) / memberCount >= 65;

        if (passed) {
            // 这里可以添加资金提取逻辑
            // 预设一个提取的方法  这个到时候可以放dao的治理代币
            // transfer(communityFund, amount);
        }

        p.executed = true;
        emit ProposalExecuted(proposalId, passed);
    }

    // 添加管理者 (仅超级管理员)
    function addManager(address account) external onlyRole(DEFAULT_ADMIN_ROLE) {
        grantRole(MANAGER_ROLE, account);
    }

    // 获取提案详情 (视图函数)
    function getProposal(
        uint256 proposalId
    )
        external
        view
        returns (
            address proposer,
            string memory title,
            string memory content,
            uint256 createTime,
            uint256 endTime,
            uint256 yesVotes,
            uint256 noVotes,
            uint256 totalVoters,
            bool executed
        )
    {
        Proposal storage p = proposals[proposalId];

        return (
            p.proposer,
            p.title,
            p.content,
            p.createTime,
            p.endTime,
            p.yesVotes,
            p.noVotes,
            p.totalVoters,
            p.executed
        );
    }

    //
    function hasVoted(
        uint256 proposalId,
        address voter
    ) external view returns (bool) {
        require(proposalId < proposalCount, "Invalid proposal ID");
        return proposals[proposalId].hasVoted[voter]; // 只返回是否投票
    }

    // 新增查询投票类型
    function getVoteType(
        uint256 proposalId,
        address voter
    ) external view returns (bool) {
        require(proposalId < proposalCount, "Invalid proposal ID");
        require(proposals[proposalId].hasVoted[voter], "Not voted"); // 直接检查映射
        return proposals[proposalId].voteChoice[voter]; // 只返回投票类型 
    }
}
