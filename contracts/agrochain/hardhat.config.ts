import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";

dotenv.config();

const config: HardhatUserConfig = {
  solidity: "0.8.20",
  networks: {
    shardeumTestnet: {
      url: process.env.SHARDEUM_RPC_URL || "https://api-mezame.shardeum.org",
      chainId: 8119,
      accounts: process.env.SHARDEUM_PRIVATE_KEY ? [process.env.SHARDEUM_PRIVATE_KEY] : [],
    },
  },
};

export default config;
