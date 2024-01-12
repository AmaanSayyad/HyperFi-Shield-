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
exports.SupplyUniswapStrategyModel = void 0;
const typeorm_1 = require("typeorm");
const model_strategy_1 = require("../strategy/model-strategy");
const model_event_1 = require("./model-event");
let SupplyUniswapStrategyModel = class SupplyUniswapStrategyModel extends model_strategy_1.StrategyModel {
    from(s) {
        this.id = s.id;
        this.name = s.name;
        this.type = s.type;
        this.network = s.network;
        this.contract = s.contract;
        this.poolId = s.data.poolId;
        this.poolFee = s.data.poolFee;
        this.token0Symbol = s.data.token0.symbol;
        this.token0Addr = s.data.token0.address;
        this.token0DataFeedAddr = s.data.token0.dataFeedAddr;
        this.token0DataFeedFactor = s.data.token0.dataFeedFactor;
        this.token1Symbol = s.data.token1.symbol;
        this.token1Addr = s.data.token1.address;
        this.token1DataFeedAddr = s.data.token1.dataFeedAddr;
        this.token1DataFeedFactor = s.data.token1.dataFeedFactor;
    }
    to() {
        return {
            id: this.id,
            name: this.name,
            type: this.type,
            network: this.network,
            contract: this.contract,
            data: {
                poolId: this.poolId,
                poolFee: this.poolFee,
                token0: {
                    symbol: this.token0Symbol,
                    address: this.token0Addr,
                    dataFeedAddr: this.token0DataFeedAddr,
                    dataFeedFactor: this.token0DataFeedFactor,
                },
                token1: {
                    symbol: this.token1Symbol,
                    address: this.token1Addr,
                    dataFeedAddr: this.token1DataFeedAddr,
                    dataFeedFactor: this.token1DataFeedFactor,
                },
            },
        };
    }
};
__decorate([
    (0, typeorm_1.Column)({ type: "text" }),
    __metadata("design:type", String)
], SupplyUniswapStrategyModel.prototype, "poolId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text" }),
    __metadata("design:type", String)
], SupplyUniswapStrategyModel.prototype, "token0Symbol", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text" }),
    __metadata("design:type", String)
], SupplyUniswapStrategyModel.prototype, "token0Addr", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text" }),
    __metadata("design:type", String)
], SupplyUniswapStrategyModel.prototype, "token0DataFeedAddr", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text" }),
    __metadata("design:type", String)
], SupplyUniswapStrategyModel.prototype, "token0DataFeedFactor", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text" }),
    __metadata("design:type", String)
], SupplyUniswapStrategyModel.prototype, "token1Symbol", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text" }),
    __metadata("design:type", String)
], SupplyUniswapStrategyModel.prototype, "token1Addr", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text" }),
    __metadata("design:type", String)
], SupplyUniswapStrategyModel.prototype, "token1DataFeedAddr", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text" }),
    __metadata("design:type", String)
], SupplyUniswapStrategyModel.prototype, "token1DataFeedFactor", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text" }),
    __metadata("design:type", String)
], SupplyUniswapStrategyModel.prototype, "poolFee", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => model_event_1.SupplyUniswapEventModel, (event) => event.strategy),
    __metadata("design:type", model_event_1.SupplyUniswapEventModel)
], SupplyUniswapStrategyModel.prototype, "events", void 0);
SupplyUniswapStrategyModel = __decorate([
    (0, typeorm_1.Entity)({
        name: "supply_uniswap_strategy",
    })
], SupplyUniswapStrategyModel);
exports.SupplyUniswapStrategyModel = SupplyUniswapStrategyModel;
