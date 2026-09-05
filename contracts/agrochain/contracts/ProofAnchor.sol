// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract ProofAnchor {
    struct AnchoredEvent {
        string eventType;
        uint256 timestamp;
        address sender;
    }

    /// @dev payloadHash => anchored event data
    mapping(bytes32 => AnchoredEvent) private _events;

    event EventAnchored(
        bytes32 indexed payloadHash,
        string eventType,
        uint256 timestamp,
        address indexed sender
    );

    /// @notice Anchor a payload hash on-chain with an event type label.
    /// @param payloadHash SHA-256 hash of the procurement payload (as bytes32).
    /// @param eventType   Human-readable label, e.g. "PROCUREMENT_COMPLETED".
    function anchorEvent(bytes32 payloadHash, string calldata eventType) external {
        require(_events[payloadHash].timestamp == 0, "Event already anchored");

        _events[payloadHash] = AnchoredEvent({
            eventType: eventType,
            timestamp: block.timestamp,
            sender: msg.sender
        });

        emit EventAnchored(payloadHash, eventType, block.timestamp, msg.sender);
    }

    /// @notice Retrieve the stored anchor record for a given payload hash.
    /// @param payloadHash The bytes32 hash to look up.
    /// @return eventType  The label that was anchored.
    /// @return timestamp  Block timestamp at the time of anchoring.
    /// @return sender     Address that called anchorEvent.
    function getEvent(bytes32 payloadHash)
        external
        view
        returns (
            string memory eventType,
            uint256 timestamp,
            address sender
        )
    {
        AnchoredEvent storage e = _events[payloadHash];
        require(e.timestamp != 0, "Event not found");
        return (e.eventType, e.timestamp, e.sender);
    }
}
