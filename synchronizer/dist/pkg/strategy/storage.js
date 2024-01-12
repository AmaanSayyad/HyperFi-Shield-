"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Database = exports.ERROR_MSG_NOT_INITIALIZED = void 0;
const typeorm_1 = require("typeorm");
exports.ERROR_MSG_NOT_INITIALIZED = "db are not initalized";
class Database {
    constructor(url, model) {
        this.ready = false;
        this.dataSource = new typeorm_1.DataSource({
            type: "postgres",
            url,
            synchronize: true,
            entities: [model],
        });
    }
    async connect() {
        await this.dataSource.initialize();
        this.ready = true;
    }
    async close() {
        if (!this.ready) {
            throw new Error(exports.ERROR_MSG_NOT_INITIALIZED);
        }
        await this.dataSource.destroy();
    }
    listStrategies() {
        throw new Error("Method not implemented.");
    }
    tokensByStrategyId(strategyId) {
        throw new Error("Method not implemented.");
    }
    listTokens() {
        throw new Error("Method not implemented.");
    }
}
exports.Database = Database;
