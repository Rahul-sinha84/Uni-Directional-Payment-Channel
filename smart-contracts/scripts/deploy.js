const hre = require("hardhat");

const main = async () => {
  const { ethers } = hre;

  const [deployer, recepient] = await ethers.getSigners();

  const Contract = await ethers.getContractFactory(
    "UniDirectionalPaymentChannel"
  );
  const contract = await Contract.deploy(recepient.address);
  await contract.deployed();

  console.log(`UniDirectionalPayment deployed to: ${contract.address}`);
};

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });
