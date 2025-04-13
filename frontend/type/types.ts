import { ethers } from "ethers";
export interface Proposal {
    id: number;
    proposer: string;
    title: string;
    content: string;
    createTime: ethers.BigNumber;
    endTime: ethers.BigNumber;
    yesVotes: ethers.BigNumber;
    noVotes: ethers.BigNumber;
    totalVoters: ethers.BigNumber;
    executed: boolean;
    hasVoted: boolean;      // 是否已投票
    votedType?: boolean;     // 投票类型 (true=赞成)
}

export interface VoteButtonProps {
    proposalId: number;
    userAddress?: `0x${string}` | null;
    hasVoted: boolean;       // 新增：是否已投票
    votedType?: boolean;    // 新增：投票类型(true=赞成, false=反对)
    onVote: (support: boolean) => Promise<void>;
}