import { useState } from "react";
import { CheckIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { VoteButtonProps } from "@/type/types";

const VoteButton: React.FC<VoteButtonProps> = ({
  proposalId,
  userAddress,
  hasVoted,
  votedType,
  onVote,
}) => {
  const [voted, setVoted] = useState<"yes" | "no" | null>(null);
  const handleVote = (support: boolean) => {
    setVoted(support ? "yes" : "no");
    onVote(support);
  };

  if (!userAddress) {
    return (
      <div className="text-sm text-gray-400">
        Please connect your wallet to vote.
      </div>
    );
  }

  if (hasVoted) {
    return (
      <div className="flex items-center gap-1 text-sm">
        {votedType ? (
          <>
            <CheckIcon className="h-5 w-5 text-green-400" />
            <span className="text-green-400">Approved</span>
          </>
        ) : (
          <>
            <XMarkIcon className="h-5 w-5 text-red-400" />
            <span className="text-red-400">Rejected</span>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="flex gap-2">
      <button
        onClick={() => handleVote(true)}
        className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
      >
        <CheckIcon className="h-5 w-5 text-green-400" />
      </button>
      <button
        onClick={() => handleVote(false)}
        className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
      >
        <XMarkIcon className="h-5 w-5 text-red-400" />
      </button>
    </div>
  );
};

export default VoteButton;
