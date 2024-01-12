"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cron = exports.ERROR_MSG_CRON_NOT_INITIALIZED = exports.ERROR_MSG_CRON_INITIALIZED = void 0;
const type_1 = require("../strategy/type");
const util_1 = require("./util");
exports.ERROR_MSG_CRON_INITIALIZED = "cron are initalized";
exports.ERROR_MSG_CRON_NOT_INITIALIZED = "cron are not initalized";
class Cron {
    constructor(strategy, intervalMs, contract, storage) {
        this._strategy = strategy;
        this.intervalMs = intervalMs;
        this.contract = contract;
        this.storage = storage;
        this.ready = false;
    }
    async close() {
        if (!this.ready) {
            throw new Error(exports.ERROR_MSG_CRON_NOT_INITIALIZED);
        }
        clearInterval(this.interval);
    }
    async init(latestDeposit, latestWithdraw) {
        if (this.ready) {
            throw new Error(exports.ERROR_MSG_CRON_INITIALIZED);
        }
        this.latestDeposit = latestDeposit;
        this.latestWithdraw = latestWithdraw;
        this.interval = setInterval(async () => {
            // get and insert new deposits from contract events into the db and then replace block number
            try {
                const deposits = await this.getNewEvents(type_1.EventType.Deposit, this.latestDeposit.block);
                if (deposits.length > 0) {
                    console.log("Supply Aave: Inserting deposits in db", deposits);
                    await this.storage.insertEvents(deposits);
                    this.latestDeposit.block = deposits[deposits.length - 1].block;
                }
            }
            catch (err) {
                console.warn(`Supply Aave: Could't get or insert deposit event, err=${err.message}`);
            }
            // get and insert new withdraws from contracts events into the db and then replace block number
            try {
                const withdraws = await this.getNewEvents(type_1.EventType.Withdraw, this.latestWithdraw.block);
                if (withdraws.length > 0) {
                    console.log("Supply Aave:: Inserting withdraw in db", withdraws);
                    await this.storage.insertEvents(withdraws);
                    this.latestWithdraw.block = withdraws[withdraws.length - 1].block;
                }
            }
            catch (err) {
                console.warn(`Supply Aave: Could't get or insert withdraw event, err=${err.message}`);
            }
        }, this.intervalMs);
    }
    async getNewEvents(type, latestBlock) {
        // prepare and get query to blockchan for getting the events
        const filterFrom = type === type_1.EventType.Deposit ? this.contract.filters.Deposit() : this.contract.filters.Withdraw();
        const fromBlockNumber = latestBlock > 0 ? latestBlock : undefined;
        const events = await this.contract.queryFilter(filterFrom, fromBlockNumber);
        if (!events.length) {
            return [];
        }
        // TODO(ca): research how get datetime using "block_number"
        // sort and find fetched events hashes inside the database
        const sortedEvents = events.sort((a, b) => a.blockNumber - b.blockNumber);
        const hashes = sortedEvents.map((e) => e.transactionHash);
        const dbHashes = (await this.storage.listEventsByHashes(this._strategy.id, hashes)).map((t) => t.hash);
        // filter, parse and prepare events to bulk insert in database
        const filtered = sortedEvents.filter((t) => !dbHashes.includes(t.transactionHash));
        if (filtered.length === 0) {
            return [];
        }
        const parsed = filtered.map((e) => (0, util_1.toEvent)(this._strategy.id, e, type));
        return parsed;
    }
}
exports.Cron = Cron;
type_1.EventType;
