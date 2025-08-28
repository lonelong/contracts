const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
    console.log("开始部署 LogWriter 合约...");

    const Factory = await ethers.getContractFactory("LogWriter");
    const contract = await Factory.deploy();
    await contract.waitForDeployment();

    const addr = await contract.getAddress();
    console.log("✅ LogWriter 已部署到:", addr);

    // 更新其他脚本中的合约地址
    const scriptsToUpdate = ["read.js", "write.js"];

    for (const scriptName of scriptsToUpdate) {
        const scriptPath = path.join(__dirname, scriptName);
        if (fs.existsSync(scriptPath)) {
            let content = fs.readFileSync(scriptPath, "utf8");
            content = content.replace(
                /const CONTRACT = "0x[a-fA-F0-9]{40}";/,
                `const CONTRACT = "${addr}";`
            );
            fs.writeFileSync(scriptPath, content);
            console.log(`✅ 已更新 ${scriptName} 中的合约地址`);
        }
    }

    console.log("\n🎉 部署完成！现在您可以运行以下命令：");
    console.log("1. 写入数据: node scripts/write.js");
    console.log("2. 读取数据: node scripts/read.js");
}

main().catch((e) => {
    console.error("❌ 部署失败:", e);
    process.exit(1);
});
