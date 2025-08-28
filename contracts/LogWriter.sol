// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/// @title LogWriter - 只用事件写数据到链上
/// @notice 不写 storage，所有数据仅通过事件对外暴露，便于链下消费与检索

contract LogWriter {
    /// @dev tag 用于分类检索（如 encodeBytes32String("note")），data 任意字节数据
    event DataWritten(
        address indexed sender,
        bytes32 indexed tag,
        bytes data,
        bytes32 dataHash,
        uint256 timestamp
    );

    function writeString(
        bytes calldata text,
        bytes32 tag
    ) external returns (bytes32 hash) {
        bytes memory b = bytes(text);
        hash = keccak256(b);
        emit DataWritten(msg.sender, tag, b, hash, block.timestamp);
    }

    function writeBytes(
        bytes calldata data,
        bytes32 tag
    ) external returns (bytes32 hash) {
        hash = keccak256(data);
        emit DataWritten(msg.sender, tag, data, hash, block.timestamp);
    }

    function writeBatch(
        bytes[] calldata items,
        bytes32 tag
    ) external returns (bytes32[] memory hashs) {
        uint256 len = items.length;
        hashs = new bytes32[](len);
        for (uint256 i = 0; i < len; i++) {
            bytes calldata d = items[i];
            bytes32 h = keccak256(d);
            hashs[i] = h;
            emit DataWritten(msg.sender, tag, d, hashs[i], block.timestamp);
        }
    }
}
