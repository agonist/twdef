import {HardhatUserConfig} from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "dotenv/config";
import * as dotenv from "dotenv";

dotenv.config();

const config: HardhatUserConfig = {
    solidity: {
        version: "0.8.17",
        settings: {
            optimizer: {
                enabled: true,
                runs: 200,
            },
        },
    },
    defaultNetwork: 'hardhat',
    networks: {
        mumbai: {
            url: process.env.MUMBAI_URL || "",
            accounts: process.env.MUMBAI_KEY !== undefined ? [process.env.MUMBAI_KEY] : [],
            gasMultiplier: 2
        },

        polygon: {
            url: process.env.POLYGON_URL || "",
            accounts: process.env.POLYGON_KEY !== undefined ? [process.env.POLYGON_KEY] : [],
            gasMultiplier: 2
        }
    },

    etherscan: {
        apiKey: process.env.ETHERSCAN_API_KEY,
    },
};

export default config;

