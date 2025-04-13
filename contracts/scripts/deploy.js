const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  
  console.log("部署者账户:", deployer.address);
  console.log("账户余额:", ethers.formatEther(await deployer.provider.getBalance(deployer.address)), "ETH");

  const DAOGovernance = await ethers.getContractFactory("DAOGovernance");
  const dao = await DAOGovernance.deploy();
  
  console.log("\n合约地址:", await dao.getAddress());
  console.log("交易哈希:", dao.deploymentTransaction().hash);
  
  // 等待3个确认
  await dao.waitForDeployment();
  console.log("部署确认完成");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});