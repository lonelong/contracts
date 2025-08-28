require("dotenv").config();
const { ethers } = require("ethers");

const RPC = process.env.SEPOLIA_RPC_URL;
const abi = [
    "event DataWritten(address indexed sender, bytes32 indexed tag, bytes data, bytes32 dataHash, uint256 timestamp)"
];
const CONTRACT = "0x772E6a348f96B5EdF0420b29726CD15dE1573e70";

async function main() {
    const provider = new ethers.JsonRpcProvider(RPC);
    const contract = new ethers.Contract(CONTRACT, abi, provider);

    // 根据 tag 过滤（null 表示不过滤）
    const tag = ethers.encodeBytes32String("demo");
    const filter = contract.filters.DataWritten(null, tag);

    // 这里 fromBlock 可设为部署区块高度；不知道的话可先用 0，再按需缩小范围
    const events = await contract.queryFilter(filter, 0, "latest");

    for (const ev of events) {
        const { sender, tag, data, dataHash, timestamp } = ev.args;
        // data 是 bytes，尽量转 utf8，再兜底打印 hex
        let text = "";
        try { text = ethers.toUtf8String(data); } catch { text = ethers.hexlify(data); }

        console.log({
            blockNumber: ev.blockNumber,
            txHash: ev.transactionHash,
            sender,
            tagUtf8: ethers.decodeBytes32String(tag),
            data: text,
            dataHash,
            timestamp: Number(timestamp),
        });
    }
}

main().catch(console.error);
