// SPDX-License-Identifier: MIT
pragma solidity <=0.8.4;

import "./Hashing.sol";

contract UniDirectionalPaymentChannel is Hashing {
    address public payer;
    address public receiver;

    //initially duration will be a week from the creation of block
    uint256 public duration = 7 * 24 * 60 * 60;
    uint256 public endTime;

    constructor(address _receiver) payable {
        payer = msg.sender;
        receiver = _receiver;
        endTime = block.timestamp + duration;
    }

    function setEndTime(uint256 _daysFromNow) public {
        require(msg.sender == payer, "Only payer required !!");
        uint256 noOfSeconds = _daysFromNow * 24 * 60 * 60;
        endTime = block.timestamp + noOfSeconds;
    }

    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }

    function withdrawAmount(uint256 _amount, bytes memory _signature) public {
        require(msg.sender == receiver, "Only Receiver required !!");
        require(getBalance() >= _amount, "Not enough funds, as of now !!");
        require(verify(_amount, payer, _signature), "Wrong Signature !!");

        (bool success, ) = receiver.call{value: _amount}("");
        require(success, "Failed to send the amount !!");
    }

    function deposit() public payable {
        require(msg.sender == payer, "Only Payer required !!");
    }

    function close(uint256 _amount, bytes memory _signature) public {
        require(msg.sender == receiver, "Only Receiver required !!");
        require(getBalance() >= _amount, "Not enough funds, as of now !!");
        require(verify(_amount, payer, _signature), "Wrong Signature !!");

        (bool success, ) = payable(receiver).call{value: _amount}("");
        require(success, "Failed to sent the amount !!");
        selfdestruct(payable(payer));
    }

    function cancel() public {
        require(msg.sender == payer, "Only Payer required !!");
        require(block.timestamp >= endTime, "End time is not over !!");
        selfdestruct(payable(payer));
    }
}
