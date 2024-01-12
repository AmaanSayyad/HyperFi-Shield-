"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Strategy = void 0;
const type_1 = require("../strategy/type");
const cron_1 = require("./cron");
const data_feed_1 = require("../data-feed");
class Strategy {
    constructor(strategy, storage, intervalMs, contract) {
        this._strategy = strategy;
        this._storage = storage;
        this._cron = new cron_1.Cron(strategy, intervalMs, contract, this._storage);
        this._token0DataFeed = new data_feed_1.DataFeed(contract.provider, strategy.data.token0.address, strategy.data.token0.dataFeedAddr, Number(strategy.data.token0.dataFeedFactor));
        this._token1DataFeed = new data_feed_1.DataFeed(contract.provider, strategy.data.token1.address, strategy.data.token1.dataFeedAddr, Number(strategy.data.token1.dataFeedFactor));
    }
    get strategy() {
        return this._strategy;
    }
    get network() {
        return this._strategy.network;
    }
    get contract() {
        return this._strategy.contract;
    }
    async init() {
        // get latest deposit/withdraw events from db
        const latestDeposit = await this._storage.getLastEventByType(this._strategy.id, type_1.EventType.Deposit);
        const latestWithdraw = await this._storage.getLastEventByType(this._strategy.id, type_1.EventType.Withdraw);
        await this._cron.init(latestDeposit, latestWithdraw);
    }
    async close() {
        await this._storage.close();
        await this._cron.close();
    }
    async insertEvents(tt) {
        return this._storage.insertEvents(tt);
    }
    async listEvents(wallet, type) {
        return this._storage.listEvents(this._strategy.id, wallet, type);
    }
    async listEventsByHashes(hashes) {
        return this._storage.listEventsByHashes(this._strategy.id, hashes);
    }
    async getLastEventByType(type) {
        return this._storage.getLastEventByType(this._strategy.id, type);
    }
    async getTokensAddresses() {
        const strategies = await this._storage.listStrategies(this._strategy.network);
        return strategies.reduce((addrs, s) => {
            const { token0: { address: token0Address }, token1: { address: token1Address }, } = s.data;
            return [
                ...addrs,
                {
                    address: token0Address,
                    network: this._strategy.network,
                },
                {
                    address: token1Address,
                    network: this._strategy.network,
                },
            ];
        }, []);
    }
    async listEventsUSD(wallet, type) {
        const events = await this._storage.listEvents(this._strategy.id, wallet, type);
        const price0 = await this._token0DataFeed.getPrice();
        const price1 = await this._token1DataFeed.getPrice();
        return events.map((event) => {
            const copy = { ...event };
            const unitToken0 = Number(copy.data.token0.amount) / 10 ** 18;
            copy.data.token0.amount = (price0 * unitToken0).toString();
            const unitToken1 = Number(copy.data.token1.amount) / 10 ** 18;
            copy.data.token1.amount = (price1 * unitToken1).toString();
            return copy;
        });
    }
}
exports.Strategy = Strategy;
