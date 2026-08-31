// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract ProofAnchor {
    event EventAnchored(
        bytes32 indexed payloadHash,
        string eventType,
        uint256 timestamp,
        address indexed sender
    );

    function anchorEvent(bytes32 payloadHash, string memory eventType) public {
        emit EventAnchored(payloadHash, eventType, block.timestamp, msg.sender);
    }
}
