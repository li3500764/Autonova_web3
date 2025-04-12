import { useState } from "react";

import { motion } from "framer-motion";
import {
  SparklesIcon,
  ScaleIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import VoteButton from "@/components/VoteButton";
import WalletButton from "@/components/WalletButton";
import SubmitProposalButton from "@/components/SubmitProposalButton";
import FundModal from "@/components/FundModal";
import { useAccount } from "wagmi";

export default function Home() {
  const [fundModalOpen, setFundModalOpen] = useState(false);
  const { address } = useAccount();

  // 模拟检查是否是管理员
  const isManager = address === "0x管理者地址";
  const fundBalance = "125.42"; // 从合约获取实际余额

  const handleWithdraw = () => {
    // 提取资金逻辑
    console.log("提取资金");
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
              公共基金
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
                <p className="text-2xl font-semibold">12</p>
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

          {/* 提案卡片 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="group bg-gradient-to-r from-purple-900/50 to-blue-900/50 rounded-2xl p-6 backdrop-blur-lg border border-white/10 hover:border-purple-400/30 transition-all"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <span className="px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 text-sm">
                    Voting
                  </span>
                  <span className="text-sm text-gray-400">Proposal #32</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">
                  AI-Powered Resource Allocation System
                </h3>
                <p className="text-gray-300 mb-4">
                  Implement neural network model for optimizing city resource
                  distribution...
                </p>
                <div className="flex items-center gap-6 text-sm">
                  <div className="flex items-center gap-2">
                    <UserGroupIcon className="h-5 w-5 text-blue-400" />
                    <span>65% Approval</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ScaleIcon className="h-5 w-5 text-purple-400" />
                    <span>$2.4M Budget</span>
                  </div>
                </div>
              </div>
              <VoteButton />
            </div>

            {/* 进度条 */}
            <div className="mt-6 h-1.5 bg-white/5 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-400 to-blue-400"
                style={{ width: "65%" }}
              />
            </div>
          </motion.div>

          {/* 更多提案卡片... */}
        </div>
      </main>
    </div>
  );
}
