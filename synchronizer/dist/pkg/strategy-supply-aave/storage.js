"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Storage = exports.ERROR_MSG_DB_NOT_INITIALIZED = exports.ERROR_MSG_DB_INITIALIZED = void 0;
const typeorm_1 = require("typeorm");
const model_event_1 = require("./model-event");
const model_strategy_1 = require("./model-strategy");
exports.ERROR_MSG_DB_INITIALIZED = "db are initalized";
exports.ERROR_MSG_DB_NOT_INITIALIZED = "db are not initalized";
class Storage {
    constructor(url) {
        this.ready = false;
        this.dataSource = new typeorm_1.DataSource({
            type: "postgres",
            url,
            synchronize: true,
            entities: [model_strategy_1.SupplyAaveStrategyModel, model_event_1.SupplyAaveEventModel],
        });
    }
    async init() {
        if (this.ready) {
            throw new Error(exports.ERROR_MSG_DB_INITIALIZED);
        }
        await this.dataSource.initialize();
        this.ready = true;
    }
    async close() {
        if (!this.ready) {
            throw new Error(exports.ERROR_MSG_DB_NOT_INITIALIZED);
        }
        await this.dataSource.destroy();
    }
    async insertEvents(tt) {
        // check if class are correctly initialized
        if (!this.ready) {
            throw new Error(exports.ERROR_MSG_DB_NOT_INITIALIZED);
        }
        const events = tt.map((t) => {
            const event = new model_event_1.SupplyAaveEventModel();
            event.from(t);
            return event;
        });
        // insert bulk in database
        const saved = await this.dataSource.manager.insert(model_event_1.SupplyAaveEventModel, events);
        if (events.length != saved.identifiers.length) {
            console.warn("the length of the pre and post events do not match");
        }
        // parse and add db id from EventModel to Event
        const parsed = events.map((t, index) => {
            const event = t.to();
            event.id = Number(saved.identifiers[index]);
            return event;
        });
        return parsed;
    }
    async listEvents(strategyId, wallet, type) {
        // check if class are correctly initialized
        if (!this.ready) {
            throw new Error(exports.ERROR_MSG_DB_NOT_INITIALIZED);
        }
        // find inside database deposit events by wallet and contract address
        const savedEvents = await this.dataSource.manager.find(model_event_1.SupplyAaveEventModel, {
            where: {
                strategyId,
                wallet,
                type,
            },
        });
        // parse from EventModel to Event
        const events = savedEvents.map((t) => t.to());
        return events;
    }
    async listEventsByHashes(strategyId, hashes) {
        // check if class are correctly initialized
        if (!this.ready) {
            throw new Error(exports.ERROR_MSG_DB_NOT_INITIALIZED);
        }
        // get and parse events from db
        const events = await this.dataSource.manager.find(model_event_1.SupplyAaveEventModel, {
            where: hashes.map((h) => ({ strategyId, hash: h })),
        });
        const parsed = events.map((t) => t.to());
        return parsed;
    }
    async getLastEventByType(strategyId, type) {
        // check if class are correctly initialized
        if (!this.ready) {
            throw new Error(exports.ERROR_MSG_DB_NOT_INITIALIZED);
        }
        // get latest event from db by event type
        const last = await this.dataSource.manager.findOne(model_event_1.SupplyAaveEventModel, {
            where: {
                strategyId,
                type,
            },
            order: {
                createdAt: "DESC",
            },
        });
        // check if exists a event response and parse
        if (!last) {
            return {
                block: -1,
            };
        }
        const parse = last.to();
        return parse;
    }
    async createStrategy(s) {
        // check if class are correctly initialized
        if (!this.ready) {
            throw new Error(exports.ERROR_MSG_DB_NOT_INITIALIZED);
        }
        const strategy = new model_strategy_1.SupplyAaveStrategyModel();
        strategy.from(s);
        // save in database
        const saved = await this.dataSource.manager.save(model_strategy_1.SupplyAaveStrategyModel, strategy);
        return saved.to();
    }
    async listStrategies(network) {
        // check if class are correctly initialized
        if (!this.ready) {
            throw new Error(exports.ERROR_MSG_DB_NOT_INITIALIZED);
        }
        // define find options if network param is defined
        const params = network
            ? {
                where: {
                    network,
                },
            }
            : undefined;
        // get and parse events from db
        const strategies = await this.dataSource.manager.find(model_strategy_1.SupplyAaveStrategyModel, params);
        const parsed = strategies.map((s) => s.to());
        return parsed;
    }
    async getStrategy(s) {
        // check if class are correctly initialized
        if (!this.ready) {
            throw new Error(exports.ERROR_MSG_DB_NOT_INITIALIZED);
        }
        // get strategy
        const find = await this.dataSource.manager.findOne(model_strategy_1.SupplyAaveStrategyModel, {
            where: {
                contract: s.contract,
                address: s.data.token.address,
            },
        });
        // check finded strategy
        if (!find) {
            return undefined;
        }
        return find.to();
    }
}
exports.Storage = Storage;
