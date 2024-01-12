"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// load env values
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// load dependencies
const ethers_1 = require("ethers");
const supply_aave_1 = require("../../typechain/supply-aave");
// check env values
const { NETWORK } = process.env;
if (!NETWORK || NETWORK === "") {
    throw new Error("invalid NETWORK env value");
}
const { ALCHEMY_API_KEY } = process.env;
if (!ALCHEMY_API_KEY || ALCHEMY_API_KEY === "") {
    throw new Error("invalid ALCHEMY_API_KEY env value");
}
const { PRIVATE_KEY } = process.env;
if (!PRIVATE_KEY || PRIVATE_KEY === "") {
    throw new Error("invalid PRIVATE_KEY env value");
}
const { CONTRACT_ADDRESS } = process.env;
if (!CONTRACT_ADDRESS || CONTRACT_ADDRESS === "") {
    throw new Error("invalid CONTRACT_ADDRESS env value");
}
// define main function
async function main() {
    const provider = new ethers_1.ethers.providers.AlchemyProvider(NETWORK, ALCHEMY_API_KEY);
    const blockNumber = await provider.getBlockNumber();
    console.log("block number", blockNumber);
    const wallet = new ethers_1.ethers.Wallet(PRIVATE_KEY, provider);
    const balance = await wallet.getBalance();
    console.log("balance", ethers_1.ethers.utils.formatEther(balance));
    const contract = new ethers_1.ethers.Contract(CONTRACT_ADDRESS, supply_aave_1.MockSupplyAave__factory.abi, provider);
    const connectedContract = contract.connect(wallet);
    console.log("sending tx...");
    const tx = await connectedContract.deposit(ethers_1.ethers.utils.parseEther("0.001"));
    console.log("before waiting tx...");
    await tx.wait();
    console.log("tx", tx);
}
main();
