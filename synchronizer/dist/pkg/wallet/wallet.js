"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Manager = void 0;
const model_1 = require("./model");
const type_1 = require("./type");
const typeorm_1 = require("typeorm");
class Manager {
    constructor(url) {
        this.ready = false;
        this.dataSource = new typeorm_1.DataSource({
            type: "postgres",
            url,
            synchronize: true,
            entities: [model_1.WalletModel],
        });
    }
    async init() {
        await this.dataSource.initialize();
        this.ready = true;
    }
    async close() {
        if (!this.ready) {
            throw new Error(type_1.ERROR_MSG_NOT_INITIALIZED);
        }
        await this.dataSource.destroy();
    }
    async listWallets(network) {
        if (!this.ready) {
            throw new Error(type_1.ERROR_MSG_NOT_INITIALIZED);
        }
        // find inside database all wallets
        // TODO(ca): implement COUNT using SQL builder
        // TODO(ca): should return count for diferent networks
        const wallets = await this.dataSource.manager.find(model_1.WalletModel, {
            where: {
            // network,
            },
        });
        const walletsAddrs = [...new Set(wallets.map((w) => w.address))];
        return walletsAddrs;
    }
    async login(network, address) {
        // check if class are correctly initialized
        if (!this.ready) {
            throw new Error(type_1.ERROR_MSG_NOT_INITIALIZED);
        }
        // prepare wallet db model
        const wallet = new model_1.WalletModel();
        wallet.network = network;
        wallet.address = address;
        // insert wallet into the db
        const saved = await this.dataSource.manager.save(model_1.WalletModel, wallet);
        const parsed = saved.to();
        return parsed;
    }
}
exports.Manager = Manager;
