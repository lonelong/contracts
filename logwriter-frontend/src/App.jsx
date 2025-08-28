import { useEffect, useState } from "react";
import { ethers } from "ethers";

function App() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [inputText, setInputText] = useState("");
  const [writing, setWriting] = useState(false);

  const SUBGRAPH_URL = "https://api.studio.thegraph.com/query/119689/sub-sepolia/v0.0.3";
  const CONTRACT_ADDRESS = "0x772E6a348f96B5EdF0420b29726CD15dE1573e70";

  const CONTRACT_ABI = [
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "sender",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "bytes32",
          "name": "tag",
          "type": "bytes32"
        },
        {
          "indexed": false,
          "internalType": "bytes",
          "name": "data",
          "type": "bytes"
        },
        {
          "indexed": false,
          "internalType": "bytes32",
          "name": "dataHash",
          "type": "bytes32"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "timestamp",
          "type": "uint256"
        }
      ],
      "name": "DataWritten",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "bytes[]",
          "name": "items",
          "type": "bytes[]"
        },
        {
          "internalType": "bytes32",
          "name": "tag",
          "type": "bytes32"
        }
      ],
      "name": "writeBatch",
      "outputs": [
        {
          "internalType": "bytes32[]",
          "name": "hashs",
          "type": "bytes32[]"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes",
          "name": "data",
          "type": "bytes"
        },
        {
          "internalType": "bytes32",
          "name": "tag",
          "type": "bytes32"
        }
      ],
      "name": "writeBytes",
      "outputs": [
        {
          "internalType": "bytes32",
          "name": "hash",
          "type": "bytes32"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes",
          "name": "text",
          "type": "bytes"
        },
        {
          "internalType": "bytes32",
          "name": "tag",
          "type": "bytes32"
        }
      ],
      "name": "writeString",
      "outputs": [
        {
          "internalType": "bytes32",
          "name": "hash",
          "type": "bytes32"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ];

  const query = `{
    dataWrittens(first: 20, orderBy: timestamp, orderDirection: desc) {
      id
      sender
      tag
      data
      dataHash
      timestamp
      blockNumber
      transactionHash
    }
  }`;

  async function fetchLogs() {
    try {
      const res = await fetch(SUBGRAPH_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });
      console.log(res);
      const json = await res.json();
      console.log(json);
      setLogs(json.data.dataWrittens);
    } catch (err) {
      console.error("Error fetching logs:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchLogs();
  }, []);

  async function handleWrite() {
    if (!inputText) return;
    if (!window.ethereum) {
      alert("请先安装 MetaMask!");
      return;
    }
    try {
      setWriting(true);
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        CONTRACT_ABI,
        signer
      );

      const tag = ethers.encodeBytes32String("demo");
      const tx = await contract.writeString(inputText, tag);
      await tx.wait();

      setInputText("");
      await fetchLogs();
    } catch (err) {
      console.error("写入失败:", err);
      alert("写入失败，请检查控制台");
    } finally {
      setWriting(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl font-bold mb-4">📜 LogWriter DApp (Sepolia)</h1>

      <div className="flex gap-2 mb-6">
        <input
          type="text"
          placeholder="输入要写入链上的内容"
          className="flex-1 p-2 border rounded-xl"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
        />
        <button
          onClick={handleWrite}
          disabled={writing}
          className="px-4 py-2 bg-blue-500 text-white rounded-xl shadow hover:bg-blue-600 disabled:opacity-50"
        >
          {writing ? "写入中..." : "写入链上"}
        </button>
      </div>

      {loading ? (
        <p>加载中...</p>
      ) : logs.length === 0 ? (
        <p>暂无数据</p>
      ) : (
        <div className="grid gap-4">
          {logs.map((log) => (
            <div key={log.id} className="rounded-2xl shadow p-4 bg-white">
              <p>
                <strong>Tx:</strong>{" "}
                <a
                  href={`https://sepolia.etherscan.io/tx/${log.transactionHash}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  {log.transactionHash.slice(0, 20)}...
                </a>
              </p>
              <p><strong>Sender:</strong> {log.sender}</p>
              <p><strong>Tag:</strong> {log.tag}</p>
              <p><strong>Data:</strong> {log.data}</p>
              <p><strong>Hash:</strong> {log.dataHash}</p>
              <p><strong>Block:</strong> {log.blockNumber}</p>
              <p><strong>Time:</strong> {new Date(Number(log.timestamp) * 1000).toLocaleString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
