// SPDX-License-Identifier: MIT
pragma solidity <=0.8.4;

contract Hashing {
    function getHash(uint256 _message) public pure returns (bytes32) {
        return keccak256(abi.encodePacked(_message));
    }

    function getEthSignedHash(bytes32 _messageHash)
        public
        pure
        returns (bytes32)
    {
        return
            keccak256(
                abi.encodePacked(
                    "\x19Ethereum Signed Message:\n32",
                    _messageHash
                )
            );
    }

    function recover(bytes32 _ethMessageHash, bytes memory _signature)
        public
        pure
        returns (address)
    {
        (bytes32 r, bytes32 s, uint8 v) = _splitSign(_signature);
        return ecrecover(_ethMessageHash, v, r, s);
    }

    function _splitSign(bytes memory _signature)
        public
        pure
        returns (
            bytes32 r,
            bytes32 s,
            uint8 v
        )
    {
        require(_signature.length == 65, "Invalid Signature !!");

        assembly {
            r := mload(add(_signature, 32))
            s := mload(add(_signature, 64))
            v := byte(0, mload(add(_signature, 96)))
        }
    }

    function verify(
        uint256 _amount,
        address _signer,
        bytes memory _signature
    ) public pure returns (bool) {
        bytes32 messageHash = getHash(_amount);
        bytes32 ethSignedHash = getEthSignedHash(messageHash);

        return recover(ethSignedHash, _signature) == _signer;
    }
}
