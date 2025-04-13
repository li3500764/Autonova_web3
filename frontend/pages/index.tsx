import { useState, useEffect } from "react";

import { motion } from "framer-motion";
import {
  SparklesIcon,
  ScaleIcon,
  UserGroupIcon,
  ClockIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";
import VoteButton from "@/components/VoteButton";
import WalletButton from "@/components/WalletButton";
import SubmitProposalButton from "@/components/SubmitProposalButton";
import FundModal from "@/components/FundModal";
import { useAccount } from "wagmi";
import {
  getProposalCount,
  getReadonlyContract,
  getProposal,
  vote,
  hasVoted,
  getVoteType,
} from "./api/daoContract"; // 封装的合约接口
import { Proposal } from "@/type/types";

export default function Home() {
  const [fundModalOpen, setFundModalOpen] = useState(false);
  const [proposalCount, setProposalCount] = useState(0);

  const { address } = useAccount();

  const [proposals, setProposals] = useState<any[]>([]);
  const [memberCount, setMemberCount] = useState(0);

  const [expandedProposals, setExpandedProposals] = useState<
    Record<number, boolean>
  >({});

  // 获取提案数据和成员总数
  useEffect(() => {
    const fetchData = async () => {
      try {
        const count = await getProposalCount();
        const members = await getReadonlyContract().memberCount();
        setMemberCount(members.toNumber());

        const proposalList = [];
        for (let i = 0; i < count; i++) {
          const proposal = await getProposal(i);
          proposalList.push({
            id: i,
            ...proposal,
          });
        }
        console.log("获取数据成功:", proposalList);
        setProposals(proposalList);
      } catch (error) {
        console.error("获取数据失败:", error);
      }
    };

    fetchData();
  }, []);

  // 计算通过率
  const calculateApprovalRate = (proposal: any) => {
    if (memberCount === 0) return 0;
    return Math.round((proposal.yesVotes / memberCount) * 100);
  };

  // 模拟检查是否是管理员
  const isManager = address === "0x管理者地址";
  const fundBalance = "125.42"; // 从合约获取实际余额

  // 获取提案总数
  useEffect(() => {
    const fetchProposalCount = async () => {
      try {
        const count = await getProposalCount();
        setProposalCount(count);
      } catch (error) {
        console.error("获取提案总数失败：", error);
      }
    };

    fetchProposalCount();
  }, []);

  const handleWithdraw = () => {
    // 提取资金逻辑
    console.log("提取资金");
  };

  // 获取提案数据
  useEffect(() => {
  const fetchData = async () => {
    try {
      const count = await getProposalCount();
      const members = await getReadonlyContract().memberCount();
      setMemberCount(members.toNumber());

      const proposalList = [];
      if (address) {
        // 连接钱包时获取完整数据
        for (let i = 0; i < count; i++) {
          const [
            proposer, 
            title,
            content,
            createTime, // 明确解构出createTime
            endTime,
            yesVotes,
            noVotes,
            totalVoters,
            executed
          ] = await getProposal(i);

          const userHasVoted = await hasVoted(i, address);

          proposalList.push({
            id: i,
            proposer,
            title,
            content,
            createTime: createTime.toNumber(), // 转换为普通数字
            endTime: endTime.toNumber(),
            yesVotes: yesVotes.toNumber(),
            noVotes: noVotes.toNumber(),
            totalVoters: totalVoters.toNumber(),
            executed,
            hasVoted: userHasVoted,
            votedType: userHasVoted
              ? await getVoteType(i, address)
              : undefined,
          });
        }
      } else {
        // 未连接钱包时获取基础数据
        for (let i = 0; i < count; i++) {
          const [
            proposer, 
            title,
            content,
            createTime,
            endTime,
            yesVotes,
            noVotes,
            totalVoters,
            executed
          ] = await getProposal(i);

          proposalList.push({
            id: i,
            proposer,
            title,
            content,
            createTime: createTime.toNumber(),
            endTime: endTime.toNumber(),
            yesVotes: yesVotes.toNumber(),
            noVotes: noVotes.toNumber(),
            totalVoters: totalVoters.toNumber(),
            executed,
            hasVoted: false,
            votedType: undefined,
          });
        }
      }

      // 按创建时间降序排序
      const sortedProposals = proposalList.sort((a, b) => b.createTime - a.createTime);
      setProposals(sortedProposals);

    } catch (error) {
      console.error("获取数据失败:", error);
    }
  };

  fetchData();
}, [address]);

  // 投票函数修正
  const handleVote = async (proposalId: number, support: boolean) => {
    try {
      await vote(proposalId, support);
      // 投票成功后刷新数据
      const updatedProposal = await getProposal(proposalId);
      setProposals((prev) =>
        prev.map((p) =>
          p.id === proposalId ? { ...p, ...updatedProposal } : p
        )
      );
    } catch (error) {
      console.error("投票失败:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      {/* 头部导航 */}
      <header className="border-b border-white/10">
        <nav className="container mx-auto flex items-center justify-between px-6 py-4">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            DAO Governance
          </h1>

          <div className="flex items-center gap-6">
            <button
              onClick={() => setFundModalOpen(true)}
              className="flex items-center gap-2 text-blue-300 hover:text-white transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Public Fund
            </button>

            <WalletButton />
          </div>
        </nav>
      </header>

      <FundModal
        isOpen={fundModalOpen}
        setIsOpen={setFundModalOpen}
        balance={fundBalance}
        isManager={isManager}
        onWithdraw={handleWithdraw}
      />

      {/* 主内容区 */}
      <main className="container mx-auto px-6 py-12">
        {/* 状态概览卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <motion.div
            whileHover={{ scale: 1.03 }}
            className="bg-white/5 rounded-2xl p-6 backdrop-blur-lg border border-white/10"
          >
            <div className="flex items-center gap-4">
              <SparklesIcon className="h-8 w-8 text-purple-400" />
              <div>
                <p className="text-sm text-gray-400">Active Proposals</p>
                <p className="text-2xl font-semibold">{proposalCount}</p>
              </div>
            </div>
          </motion.div>
          {/* 其他状态卡片... */}
        </div>

        {/* 提案列表 */}
        <div className="space-y-6">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-semibold">Council Proposals</h2>
            <SubmitProposalButton />
          </div>

          {proposals.map((proposal) => (
            <motion.div
              key={proposal.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="group bg-gradient-to-r from-purple-900/50 to-blue-900/50 rounded-2xl p-6 backdrop-blur-lg border border-white/10 hover:border-purple-400/30 transition-all mb-6"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  {/* 提案状态和编号 */}
                  <div className="flex items-center gap-3 mb-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        proposal.executed
                          ? "bg-green-500/10 text-green-400"
                          : new Date(proposal.endTime * 1000) > new Date()
                          ? "bg-purple-500/10 text-purple-400"
                          : "bg-gray-500/10 text-gray-400"
                      }`}
                    >
                      {proposal.executed
                        ? "Executed"
                        : new Date(proposal.endTime * 1000) > new Date()
                        ? "Voting"
                        : "Closed"}
                    </span>
                    <span className="text-sm text-gray-400">
                      Proposal #{proposal.id}
                    </span>
                  </div>

                  {/* 提案标题 */}
                  <h3 className="text-lg font-semibold mb-2">
                    {proposal.title}
                  </h3>

                  {/* 可折叠的提案内容 */}
                  <div className="text-gray-300 mb-4 relative">
                    <div
                      className={`whitespace-pre-line overflow-hidden transition-all duration-300 ${
                        expandedProposals[proposal.id] ? "" : "max-h-24"
                      }`}
                    >
                      {proposal.content}
                    </div>
                    {proposal.content.split("\n").length > 4 && (
                      <button
                        onClick={() =>
                          setExpandedProposals((prev) => ({
                            ...prev,
                            [proposal.id]: !prev[proposal.id],
                          }))
                        }
                        className="absolute right-0 bottom-0 flex items-center justify-center w-6 h-6 bg-gray-800/50 rounded-full hover:bg-gray-700 transition-colors"
                        aria-label={
                          expandedProposals[proposal.id]
                            ? "收起内容"
                            : "展开内容"
                        }
                      >
                        <ChevronDownIcon
                          className={`h-4 w-4 text-gray-400 transition-transform duration-300 ${
                            expandedProposals[proposal.id] ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                    )}
                  </div>

                  {/* 提案统计信息 */}
                  <div className="flex items-center gap-6 text-sm">
                    <div className="flex items-center gap-2">
                      <UserGroupIcon className="h-5 w-5 text-blue-400" />
                      <span>{calculateApprovalRate(proposal)}% Approval Rate</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ClockIcon className="h-5 w-5 text-purple-400" />
                      <span>
                        Deadline:{" "}
                        {new Date(proposal.endTime * 1000).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 投票按钮 */}
                {!proposal.executed &&
                  new Date(proposal.endTime * 1000) > new Date() && (
                    <VoteButton
                      proposalId={proposal.id}
                      userAddress={address}
                      hasVoted={proposal.hasVoted}
                      votedType={proposal.votedType}
                      onVote={(support) => handleVote(proposal.id, support)}
                    />
                  )}
              </div>

              {/* 动态进度条 */}
              <div className="mt-6 h-1.5 bg-white/5 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-400 to-blue-400"
                  style={{ width: `${calculateApprovalRate(proposal)}%` }}
                />
              </div>
            </motion.div>
          ))}
          {/* 更多提案卡片... */}
        </div>
      </main>
    </div>
  );
}
