import { ethers } from "ethers";
import DAOGovernanceABI from "../../abi/DAOGovernance.json";

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "0xYourContractAddress";

// 公共只读provider（无需钱包连接）
const readProvider = new ethers.providers.JsonRpcProvider(
  "https://ethereum-sepolia-rpc.publicnode.com"
);

// 获取可写provider（需要钱包连接）
const getWriteProvider = (): ethers.providers.Web3Provider => {
  if (typeof window === "undefined" || !(window as any).ethereum) {
    throw new Error("请安装MetaMask并连接钱包");
  }
  return new ethers.providers.Web3Provider((window as any).ethereum);
};

// 只读合约实例（用于查询）
export const getReadonlyContract = () => {
  return new ethers.Contract(CONTRACT_ADDRESS, DAOGovernanceABI, readProvider);
};

// 可写合约实例（用于交易）
export const getWritableContract = () => {
  const provider = getWriteProvider();
  const signer = provider.getSigner();
  return new ethers.Contract(CONTRACT_ADDRESS, DAOGovernanceABI, signer);
};

// 封装只读方法
export const getProposalCount = async (): Promise<number> => {
  const contract = getReadonlyContract();
  const count = await contract.proposalCount();
  return count.toNumber(); 
};

// 获取提案函数添加返回类型
export const getProposal = async (id: number): Promise<[
  string,   // proposer
  string,   // title
  string,   // content
  ethers.BigNumber, // createTime
  ethers.BigNumber, // endTime
  ethers.BigNumber, // yesVotes
  ethers.BigNumber, // noVotes
  ethers.BigNumber, // totalVoters
  boolean   // executed
]> => {
  const contract = getReadonlyContract();
  return await contract.getProposal(id);
};

// 封装写入方法
export const createProposal = async (title: string, content: string) => {
  const contract = getWritableContract();
  const tx = await contract.createProposal(title, content);
  return await tx.wait();
};

// 添加创建提案方法
// export const createProposal = async (title: string, content: string): Promise<ethers.ContractReceipt> => {
//   const contract = getWritableContract();
//   const tx = await contract.createProposal(title, content);
//   return await tx.wait();
// };

// 投票函数添加返回类型
export const vote = async (proposalId: number, support: boolean): Promise<ethers.ContractReceipt> => {
  const contract = getWritableContract();
  const tx = await contract.vote(proposalId, support);
  return await tx.wait();
};

// 检查用户是否已投票
export const hasVoted = async (proposalId: number, userAddress: string): Promise<boolean> => {
  const contract = getReadonlyContract();
  return await contract.hasVoted(proposalId, userAddress);
};

// 获取投票类型 (true=赞成, false=反对)
export const getVoteType = async (proposalId: number, userAddress: string): Promise<boolean> => {
  const contract = getReadonlyContract();
  return await contract.getVoteType(proposalId, userAddress);
};

// 成员相关方法
export const checkIsMember = async (address: string): Promise<boolean> => {
  const contract = getReadonlyContract();
  return await contract.isMember(address);
};

export const joinDAO = async (): Promise<ethers.ContractReceipt> => {
  const contract = getWritableContract();
  const tx = await contract.joinDAO();
  return await tx.wait();
};

// 添加检查管理员权限的方法
export const checkIsManager = async (address: string): Promise<boolean> => {
  const contract = getReadonlyContract();
  const MANAGER_ROLE = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("MANAGER_ROLE"));
  return await contract.hasRole(MANAGER_ROLE, address);
};

