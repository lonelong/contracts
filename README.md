# LogWriter 项目设置指南

## 问题解决

如果您遇到 "Failed to fetch start block: Failed to fetch contract deployment transaction" 错误，请按照以下步骤操作：

## 1. 环境变量配置

### 创建 .env 文件
在项目根目录创建 `.env` 文件（复制 `env.example` 的内容并填入真实值）：

```env
# Sepolia 测试网 RPC URL
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_PROJECT_ID

# 您的私钥（用于部署和交易签名）
PRIVATE_KEY=your_private_key_here

# Etherscan API Key（用于验证合约）
ETHERSCAN_API_KEY=your_etherscan_api_key_here
```

### 获取必要的配置信息

#### RPC URL
1. 访问 [Infura](https://infura.io/) 或 [Alchemy](https://www.alchemy.com/)
2. 注册账户并创建新项目
3. 选择 Sepolia 网络
4. 复制 RPC URL

#### 私钥
1. 使用 MetaMask 创建测试账户
2. 导出私钥（确保是测试账户，不要使用主网账户）
3. 确保账户有足够的 Sepolia ETH

#### Etherscan API Key
1. 访问 [Etherscan](https://etherscan.io/apis)
2. 注册账户并创建 API Key

## 2. 部署合约

配置好环境变量后，运行：

```bash
npx hardhat run scripts/deploy-and-update.js --network sepolia
```

这个脚本会：
- 部署 LogWriter 合约
- 自动更新 `read.js` 和 `write.js` 中的合约地址

## 3. 测试功能

### 写入数据
```bash
node scripts/write.js
```

### 读取数据
```bash
node scripts/read.js
```

## 4. 常见问题

### 问题：环境变量未设置
**解决方案**：确保 `.env` 文件存在且包含正确的值

### 问题：RPC 连接失败
**解决方案**：检查 RPC URL 是否正确，网络是否可达

### 问题：私钥错误
**解决方案**：确保私钥格式正确，账户有足够的 ETH

### 问题：合约地址错误
**解决方案**：重新运行部署脚本，它会自动更新地址

## 5. 项目结构

```
├── contracts/
│   └── LogWriter.sol          # 智能合约
├── scripts/
│   ├── deploy.js              # 基础部署脚本
│   ├── deploy-and-update.js   # 改进的部署脚本
│   ├── write.js               # 写入数据脚本
│   └── read.js                # 读取数据脚本
├── .env                       # 环境变量（需要创建）
├── env.example                # 环境变量示例
└── hardhat.config.js          # Hardhat 配置
```

## 6. 合约功能

LogWriter 合约提供以下功能：
- `writeString()`: 写入字符串数据
- `writeBytes()`: 写入字节数据
- `writeBatch()`: 批量写入数据

所有数据通过事件记录，不占用存储空间，便于链下检索。
