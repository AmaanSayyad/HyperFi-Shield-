"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SupplyAaveStrategyModel = void 0;
const typeorm_1 = require("typeorm");
const model_strategy_1 = require("../strategy/model-strategy");
const model_event_1 = require("./model-event");
let SupplyAaveStrategyModel = class SupplyAaveStrategyModel extends model_strategy_1.StrategyModel {
    from(s) {
        this.id = s.id;
        this.name = s.name;
        this.type = s.type;
        this.network = s.network;
        this.contract = s.contract;
        this.symbol = s.data.token.symbol;
        this.address = s.data.token.address;
        this.dataFeedAddr = s.data.token.dataFeedAddr;
        this.dataFeedFactor = s.data.token.dataFeedFactor;
    }
    to() {
        return {
            id: this.id,
            name: this.name,
            type: this.type,
            network: this.network,
            contract: this.contract,
            data: {
                token: {
                    symbol: this.symbol,
                    address: this.address,
                    dataFeedAddr: this.dataFeedAddr,
                    dataFeedFactor: this.dataFeedFactor,
                },
            },
        };
    }
};
__decorate([
    (0, typeorm_1.Column)({ type: "text" }),
    __metadata("design:type", String)
], SupplyAaveStrategyModel.prototype, "symbol", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text" }),
    __metadata("design:type", String)
], SupplyAaveStrategyModel.prototype, "address", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text" }),
    __metadata("design:type", String)
], SupplyAaveStrategyModel.prototype, "dataFeedAddr", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text" }),
    __metadata("design:type", String)
], SupplyAaveStrategyModel.prototype, "dataFeedFactor", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => model_event_1.SupplyAaveEventModel, (event) => event.strategy),
    __metadata("design:type", Array)
], SupplyAaveStrategyModel.prototype, "events", void 0);
SupplyAaveStrategyModel = __decorate([
    (0, typeorm_1.Entity)({
        name: "supply_aave_strategy",
    })
], SupplyAaveStrategyModel);
exports.SupplyAaveStrategyModel = SupplyAaveStrategyModel;
