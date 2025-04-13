"use client";
import { Dialog } from "@headlessui/react";
import { useState } from "react";
import { useAccount } from "wagmi";
import { createProposal } from "@/pages/api/daoContract";
import toast from "react-hot-toast";

interface SubmitProposalModalProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export default function SubmitProposalModal({
  isOpen,
  setIsOpen,
}: SubmitProposalModalProps) {
  const { address } = useAccount();
  const [title, setTitle] = useState(""); // 新增标题状态
  const [description, setDescription] = useState("");
  const [generatedProposal, setGeneratedProposal] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [isGenerating, setIsGenerating] = useState(false); // 生成中状态
  const [isSubmitting, setIsSubmitting] = useState(false); // 提交中状态

  async function handleGenerate() {
    if (!description.trim()) {
      setError("Please enter proposal description");
      return;
    }
    const currentTime = new Date().toLocaleString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
    setIsGenerating(true);
    setLoading(true);
    setError(null);
    const systemMessage = {
      role: "system",
      content: `You are a government proposal writing expert. Current time is ${currentTime}. Please generate a formal proposal meeting these requirements:
        
        1. Use standard government document format
        2. Include six sections: "Proposal Title", "Proposer", "Submission Date", 
           "Background Analysis", "Specific Recommendations", "Expected Outcomes"
        3. Strictly limit to 180-220 words total
        4. Use formal, professional government language
        5. Recommendations should be actionable
        6. Include timestamp and proposer at the end
        
       Use this submission date: ${currentTime}`,
    };
    try {
      const response = await fetch(process.env.NEXT_PUBLIC_DEEPSEEK_API_URL!, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_DEEPSEEK_API_KEY}`,
        },
        body: JSON.stringify({
          model: "deepseek-chat",
          messages: [
            {
              role: "system",
              content: `Proposal Requirements: ${description}`,
            },
            {
              role: "user",
              content: `Generate a proposal based on: ${description}`,
            },
          ],
          temperature: 0.5, // Reduce randomness for more stable output
          max_tokens: 500,
        }),
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();
      const proposal =
        data.choices?.[0]?.message?.content || "Failed to generate proposal, please try again";
      setGeneratedProposal(proposal);
    } catch (err) {
      console.error("API call error:", err);
      setError("Failed to generate proposal, please check network or try again later");
    } finally {
      setIsGenerating(false);
    }
  }

  async function handleConfirm() {
    if (!title.trim()) {
      setError("Please enter proposal title");
      return;
    }
    if (!generatedProposal) {
      setError("Please generate proposal content first");
      return;
    }
    setIsSubmitting(true);
    try {
      const receipt = await createProposal(title, generatedProposal);
      toast.success("Proposal submitted successfully!");
      console.log("Transaction receipt:", receipt);

      // Clear form
      setTitle("");
      setDescription("");
      setGeneratedProposal("");
      setIsOpen(false);
    } catch (error) {
      console.error("Proposal submission failed:", error);
      toast.error(
        `Submission failed: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog
      open={isOpen}
      onClose={() => setIsOpen(false)}
      className="fixed z-50 inset-0 overflow-y-auto"
    >
      <div className="flex items-center justify-center min-h-screen px-4">
        {/* 霓虹光晕背景层 */}
        <div
          className="fixed inset-0 bg-gradient-to-br from-purple-900/30 via-blue-900/20 to-transparent"
          style={{
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
          }}
          aria-hidden="true"
        />

        {/* 主弹窗容器 - 赛博朋克风格 */}
        <div className="relative bg-gray-900 rounded-xl border border-purple-500/30 w-full max-w-2xl p-6 z-50 shadow-2xl shadow-purple-500/20">
          {/* 霓虹边框效果 */}
          <div
            className="absolute inset-0 rounded-xl pointer-events-none"
            style={{
              boxShadow: "inset 0 0 15px rgba(139, 92, 246, 0.3)",
            }}
          />

          {/* 科技感关闭按钮 */}
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-5 right-5 group"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-purple-500 rounded-full opacity-0 group-hover:opacity-20 transition-opacity" />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-purple-400 group-hover:text-purple-300 transition-colors"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
          </button>

          {/* 标题 - 霓虹文字效果 */}
          <Dialog.Title className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">
            New Proposal Generator
          </Dialog.Title>

          {error && (
            <div className="mt-4 p-3 bg-red-900/50 border border-red-700/50 rounded-lg">
              <p className="text-red-300">{error}</p>
            </div>
          )}

          {/* 新增标题输入框 */}
          <div className="mt-6 bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Proposal Title
            </label>
            <input
              type="text"
              className="w-full bg-gray-800/70 text-gray-200 border border-gray-700 focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 rounded-lg p-3 transition-all"
              placeholder="Enter proposal title..."
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setError(null);
              }}
            />
          </div>

          {/* 输入区 - 玻璃拟态效果 */}
          <div className="mt-6 bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Proposal Description
            </label>
            <textarea
              className="scrollbar-tech w-full bg-gray-800/70 text-gray-200 border border-gray-700 focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 rounded-lg p-3 transition-all"
              rows={4}
              placeholder="Please describe your proposal in detail..."
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                setError(null);
              }}
            />
            <div className="mt-2 flex justify-between items-center">
              <span className="text-xs text-gray-400">
                {description.length}/500
              </span>
              <button
                className="relative overflow-hidden px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg hover:from-purple-500 hover:to-blue-500 transition-all disabled:opacity-50"
                onClick={handleGenerate}
                disabled={isGenerating || !description.trim()}
              >
                {isGenerating ? (
                  <span className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Generating...
                  </span>
                ) : (
                  <>
                    <span className="relative z-10">Generate Proposal</span>
                    <span className="absolute inset-0 bg-gradient-to-r from-purple-500/30 to-blue-500/30 opacity-0 hover:opacity-100 transition-opacity" />
                  </>
                )}
              </button>
            </div>
          </div>

          {generatedProposal && (
            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-200">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-300 to-blue-300">
                    Generation result
                  </span>
                </h3>
                <span className="text-xs px-2 py-1 bg-gray-800 text-blue-400 rounded-full">
                  {new Date().toLocaleString("zh-CN")}
                </span>
              </div>

              {/* 可编辑提案内容 - 终端风格 */}
              <div className="relative">
                <div className="absolute inset-0 bg-gray-900/50 border border-gray-700/50 rounded-lg" />
                <textarea
                  className="relative w-full bg-gray-900/70 text-gray-200 font-mono text-sm p-4 rounded-lg border border-gray-700/50 focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/30 min-h-[200px]"
                  value={generatedProposal}
                  onChange={(e) => setGeneratedProposal(e.target.value)}
                />
              </div>

              {/* 操作按钮组 */}
              <div className="flex justify-end space-x-3 pt-2">
                <button
                  className="px-4 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-800/50 transition-colors"
                  onClick={() => setIsOpen(false)}
                  disabled={isSubmitting} // 新增：提交时禁用取消按钮
                >
                  Cancel
                </button>
                <button
                  className={`px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-500 hover:to-blue-500 transition-all ${
                    isSubmitting ? "opacity-75 cursor-not-allowed" : ""
                  }`}
                  onClick={handleConfirm}
                  disabled={isSubmitting || !title || !generatedProposal} // 新增禁用条件
                >
                  {isSubmitting ? (
                    <span className="flex items-center">
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Submitting...
                    </span>
                  ) : (
                    <span className="drop-shadow-[0_0_2px_rgba(139,92,246,0.8)]">
                      Submit a proposal
                    </span>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Dialog>
  );
}
