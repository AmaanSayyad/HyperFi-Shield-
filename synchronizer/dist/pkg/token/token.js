"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Manager = void 0;
const alchemy_web3_1 = require("@alch/alchemy-web3");
const ethers_1 = require("ethers");
const synchronizer_1 = require("../../synchronizer");
class Manager {
    constructor(url, provider, cache) {
        this.client = (0, alchemy_web3_1.createAlchemyWeb3)(url);
        this.provider = provider;
        this.cache = cache;
    }
    async getNativeToken(wallet) {
        try {
            // get native token balance
            const balance = await this.provider.getBalance(wallet);
            // get native token symbol
            const networkInfo = await this.provider.getNetwork();
            const symbol = synchronizer_1.NativeTokenSymbol[networkInfo.name];
            // define native token
            const token = {
                balance: balance.toString(),
                symbol,
                decimals: 18,
                isNative: true,
            };
            return token;
        }
        catch (err) {
            throw err;
        }
    }
    async getTokens(wallet, contracts) {
        try {
            console.log("1111");
            console.log("1111");
            console.log("1111", contracts);
            // define tokens array with native token
            const tokens = [];
            // get tokens contras
            const balances = await this.client.alchemy.getTokenBalances(wallet, contracts);
            // check if token balances is empty
            if (!balances.tokenBalances.length) {
                return tokens;
            }
            for (const { error, tokenBalance, contractAddress: contract } of balances.tokenBalances) {
                if (error) {
                    console.warn(`can't get balance for token_addr=${contract} err=${error}`);
                }
                // parse balance to bignumber format
                const balance = ethers_1.BigNumber.from(tokenBalance);
                // get token metadata from the cache, if cache not present fetch to alchemy
                let meta;
                if (this.cache.has(contract)) {
                    meta = this.cache.get(contract);
                }
                else {
                    meta = await this.client.alchemy.getTokenMetadata(contract);
                    this.cache.set(contract, meta);
                }
                // check if decimal are present, if not stop the iteration
                if (!meta.decimals) {
                    console.warn(`can't get meta decimals for token_addr=${contract}`);
                    continue;
                }
                // TODO(ca): move to base util file
                // prepare symbol
                let symbol;
                switch (meta.symbol) {
                    case "ETH":
                    case "WETH":
                    case "MATIC":
                    case "LINK":
                    case "WMATIC":
                        symbol = meta.symbol;
                        break;
                    default:
                        throw new Error(`invalid token_symbol=${meta.symbol}`);
                }
                // prepare token
                const token = {
                    balance: balance.toString(),
                    decimals: meta.decimals,
                    symbol,
                    address: contract,
                    isNative: false,
                };
                tokens.push(token);
            }
            return tokens;
        }
        catch (err) {
            throw err;
        }
    }
}
exports.Manager = Manager;
