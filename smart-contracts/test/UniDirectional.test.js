const { ethers, waffle } = require("hardhat");
const chai = require("./setupChai");

const { expect } = chai;

describe("Uni-Directional-Payment-Channel", () => {
  let payer,
    receiver,
    contract,
    currentBlock,
    provider = waffle.provider;

  before(async () => {
    [payer, receiver] = await ethers.getSigners();
    const Contract = await ethers.getContractFactory(
      "UniDirectionalPaymentChannel"
    );
    contract = await Contract.deploy(receiver.address);
    await contract.deployed();
    currentBlock = await provider.getBlock("latest");
  });

  it("Contract deployed Successfully !!", async () => {
    expect(contract.address).to.not.be.equal(0x0);
    expect(contract.address).to.not.be.equal(null);
    expect(contract.address).to.not.be.equal(undefined);
    expect(contract.address).to.not.be.equal("");
  });

  it("Contract initial Values !!", async () => {
    const _receiverAddress = await contract.receiver();
    const _payerAddress = await contract.payer();
    expect(_receiverAddress).to.be.equal(receiver.address);
    expect(_payerAddress).to.be.equal(payer.address);
    const _duration = await contract.duration();
    const duration = 7 * 24 * 60 * 60;
    expect(_duration).to.be.equal(duration);
    await expect(contract.endTime()).to.eventually.be.equal(
      currentBlock.timestamp + +_duration
    );
  });

  it("Checking Hashing functions !!", async () => {
    const amountInEther = 20;
    const amountInWei = ethers.utils.parseEther(`${amountInEther}`);
    const _messageHash = await contract.getHash(amountInWei);
    const _ethSignedHash = await contract.getEthSignedHash(_messageHash);
    const signature = await payer.signMessage(
      ethers.utils.arrayify(_messageHash)
    );
    const _expectedAddress = await contract.recover(_ethSignedHash, signature);
    expect(_expectedAddress).to.be.equal(payer.address);
    const _success = await contract.verify(
      amountInWei,
      payer.address,
      signature
    );
    expect(_success).to.be.equal(true);
  });

  it("Setting end time !!", async () => {
    const daysFromNow = 15;
    const daysFromNowSec = daysFromNow * 24 * 60 * 60;
    await expect(
      contract.connect(receiver).setEndTime(daysFromNow),
      "Receiver shouldn't have access to set the end time !!"
    ).to.eventually.be.rejected;
    await expect(contract.setEndTime(daysFromNow)).to.eventually.be.fulfilled;
    const latestBlock = await provider.getBlock();
    const _endTime = await contract.endTime();
    expect(latestBlock.timestamp + daysFromNowSec).to.be.equal(_endTime);
  });

  it("Depositing Amount !!", async () => {
    const amountInEther = 20;
    const amountInWei = ethers.utils.parseEther(`${amountInEther}`);
    const prevPayerBalance = await provider.getBalance(payer.address);
    await expect(
      contract.connect(receiver).deposit({ value: amountInWei }),
      "Receiver shouldn't have access to deposit amount !!"
    ).to.eventually.be.rejected;
    await expect(contract.deposit({ value: amountInWei })).to.eventually.be
      .fulfilled;
    const _balance = await contract.getBalance();
    expect(_balance).to.be.equal(amountInWei);
    const afterPayerBalance = await provider.getBalance(payer.address);
    const balanceValidation =
      prevPayerBalance - afterPayerBalance >= amountInWei &&
      prevPayerBalance - afterPayerBalance <= ethers.utils.parseEther("21");
    expect(balanceValidation).to.be.equal(true);
  });

  it("Withdraw Amount !!", async () => {
    const amountToWithdraw = 15;
    const amountToWithdrawWei = ethers.utils.parseEther(`${amountToWithdraw}`);
    const _messageHash = await contract.getHash(amountToWithdrawWei);
    const receiverSignature = await receiver.signMessage(
      ethers.utils.arrayify(_messageHash)
    );
    const _wrongMessageHash = await contract.getHash(
      ethers.utils.parseEther("20")
    );
    const wrongAmountSignature = await payer.signMessage(
      ethers.utils.arrayify(_wrongMessageHash)
    );
    const correctSignature = await payer.signMessage(
      ethers.utils.arrayify(_messageHash)
    );
    const prevReceiverBal = await provider.getBalance(receiver.address);
    await expect(
      contract.withdrawAmount(amountToWithdrawWei, correctSignature),
      "Only Receiver !!"
    ).to.eventually.be.rejected;
    await expect(
      contract
        .connect(receiver)
        .withdrawAmount(amountToWithdrawWei, wrongAmountSignature),
      "Hash is wrong !!"
    ).to.eventually.be.rejected;
    await expect(
      contract
        .connect(receiver)
        .withdrawAmount(amountToWithdrawWei, receiverSignature),
      "Signature should be signed by payer !!"
    ).to.eventually.be.rejected;
    await expect(
      contract
        .connect(receiver)
        .withdrawAmount(amountToWithdrawWei, correctSignature)
    ).to.eventually.be.fulfilled;
    const afterReceiverBal = await provider.getBalance(receiver.address);
    const balanceValidation =
      afterReceiverBal - prevReceiverBal <= amountToWithdrawWei &&
      afterReceiverBal - prevReceiverBal >= ethers.utils.parseEther("14");
    expect(balanceValidation).to.be.equal(true);
  });

  it("Cancel the contract !!", async () => {
    const prevPayerBal = await provider.getBalance(payer.address);
    await expect(contract.connect(receiver).cancel(), "Only Payer required !!")
      .to.eventually.be.rejected;
    await expect(contract.cancel(), "End Time is far !!").to.eventually.be
      .rejected;
    //forwarding time
    await provider.send("evm_increaseTime", [15 * 24 * 60 * 60]);
    await expect(contract.cancel(), "End Time is far !!").to.eventually.be
      .fulfilled;
    const afterPayerBal = await provider.getBalance(payer.address);
    const balanceValidation =
      afterPayerBal - prevPayerBal <= ethers.utils.parseEther("5") &&
      afterPayerBal - prevPayerBal >= ethers.utils.parseEther("4");
    expect(balanceValidation).to.be.equal(true);
  });
});
