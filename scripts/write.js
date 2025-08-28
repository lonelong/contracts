require("dotenv").config();
const { ethers } = require("ethers");

const RPC = process.env.SEPOLIA_RPC_URL;
const PK = process.env.PRIVATE_KEY;

// 从 artifacts 读取 ABI（也可以手写）
const abi = [
    "event DataWritten(address indexed sender, bytes32 indexed tag, bytes data, bytes32 dataHash, uint256 timestamp)",
    "function writeString(bytes text, bytes32 tag) external returns (bytes32)",
    "function writeBytes(bytes data, bytes32 tag) external returns (bytes32)",
    "function writeBatch(bytes[] items, bytes32 tag) external returns (bytes32[])"
];

const CONTRACT = "0x772E6a348f96B5EdF0420b29726CD15dE1573e70";

async function main() {
    const provider = new ethers.JsonRpcProvider(RPC);
    const wallet = new ethers.Wallet(PK, provider);
    const contract = new ethers.Contract(CONTRACT, abi, wallet);

    // 1) 写入一条字符串
    const tag = ethers.encodeBytes32String("demo");
    const textBytes = ethers.toUtf8Bytes("Hello Sepolia via Event!");
    const tx1 = await contract.writeString(textBytes, tag);
    console.log("writeString tx:", tx1.hash);
    await tx1.wait();

    // 2) 批量写入（三条）
    const batch = [
        ethers.toUtf8Bytes("alpha"),
        ethers.toUtf8Bytes("beta"),
        ethers.toUtf8Bytes("gamma"),
    ];
    const tx2 = await contract.writeBatch(batch, tag);
    console.log("writeBatch tx:", tx2.hash);
    await tx2.wait();
}

main().catch(console.error);
