require("dotenv").config();
const { ethers } = require("hardhat");

async function main() {
    console.log("🔍 LogWriter 项目诊断工具");
    console.log("=".repeat(50));

    // 1. 检查环境变量
    console.log("\n1. 环境变量检查:");
    const envVars = {
        'SEPOLIA_RPC_URL': process.env.SEPOLIA_RPC_URL,
        'PRIVATE_KEY': process.env.PRIVATE_KEY,
        'ETHERSCAN_API_KEY': process.env.ETHERSCAN_API_KEY
    };

    for (const [key, value] of Object.entries(envVars)) {
        if (value) {
            console.log(`✅ ${key}: 已设置`);
            if (key === 'PRIVATE_KEY') {
                console.log(`   📝 私钥长度: ${value.length} 字符`);
                console.log(`   📝 账户地址: ${new ethers.Wallet(value).address}`);
            }
        } else {
            console.log(`❌ ${key}: 未设置`);
        }
    }

    // 2. 检查网络连接
    console.log("\n2. 网络连接检查:");
    if (process.env.SEPOLIA_RPC_URL) {
        try {
            const provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);
            const network = await provider.getNetwork();
            const blockNumber = await provider.getBlockNumber();
            console.log(`✅ Sepolia 网络连接成功`);
            console.log(`   📝 网络 ID: ${network.chainId}`);
            console.log(`   📝 当前区块: ${blockNumber}`);
        } catch (error) {
            console.log(`❌ Sepolia 网络连接失败: ${error.message}`);
        }
    } else {
        console.log(`❌ 无法检查网络连接 - RPC URL 未设置`);
    }

    // 3. 检查合约编译
    console.log("\n3. 合约编译检查:");
    try {
        const Factory = await ethers.getContractFactory("LogWriter");
        console.log(`✅ LogWriter 合约编译成功`);
        console.log(`   📝 合约名称: ${Factory.interface.fragments[0].name}`);
    } catch (error) {
        console.log(`❌ LogWriter 合约编译失败: ${error.message}`);
    }

    // 4. 检查账户余额
    console.log("\n4. 账户余额检查:");
    if (process.env.PRIVATE_KEY && process.env.SEPOLIA_RPC_URL) {
        try {
            const provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);
            const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
            const balance = await wallet.getBalance();
            const balanceEth = ethers.formatEther(balance);
            console.log(`✅ 账户余额检查成功`);
            console.log(`   📝 账户地址: ${wallet.address}`);
            console.log(`   📝 余额: ${balanceEth} ETH`);

            if (balance === 0n) {
                console.log(`⚠️  警告: 账户余额为 0，无法部署合约`);
                console.log(`   💡 请访问 https://sepoliafaucet.com/ 获取测试 ETH`);
            } else if (balance < ethers.parseEther("0.01")) {
                console.log(`⚠️  警告: 余额较低，可能不足以支付部署费用`);
            }
        } catch (error) {
            console.log(`❌ 账户余额检查失败: ${error.message}`);
        }
    } else {
        console.log(`❌ 无法检查账户余额 - 私钥或 RPC URL 未设置`);
    }

    console.log("\n" + "=".repeat(50));
    console.log("诊断完成！");

    // 5. 提供建议
    console.log("\n📋 建议:");
    if (!process.env.SEPOLIA_RPC_URL) {
        console.log("1. 设置 SEPOLIA_RPC_URL - 访问 https://infura.io/ 或 https://www.alchemy.com/");
    }
    if (!process.env.PRIVATE_KEY) {
        console.log("2. 设置 PRIVATE_KEY - 从 MetaMask 导出测试账户私钥");
    }
    if (!process.env.ETHERSCAN_API_KEY) {
        console.log("3. 设置 ETHERSCAN_API_KEY - 访问 https://etherscan.io/apis");
    }

    console.log("\n🚀 配置完成后，运行以下命令部署合约:");
    console.log("   npx hardhat run scripts/deploy-and-update.js --network sepolia");
}

main().catch((error) => {
    console.error("❌ 诊断过程中发生错误:", error);
    process.exit(1);
});
