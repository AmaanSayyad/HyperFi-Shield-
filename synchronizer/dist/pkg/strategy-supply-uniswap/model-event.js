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
exports.SupplyUniswapEventModel = void 0;
const model_event_1 = require("../strategy/model-event");
const typeorm_1 = require("typeorm");
const model_strategy_1 = require("./model-strategy");
let SupplyUniswapEventModel = class SupplyUniswapEventModel extends model_event_1.EventModel {
    from(t) {
        this.strategyId = t.strategyId;
        this.hash = t.hash;
        this.block = t.block;
        this.type = t.type;
        this.wallet = t.wallet;
        this.token0Addr = t.data.token0.address;
        this.amount0 = t.data.token0.amount;
        this.token1Addr = t.data.token1.address;
        this.amount1 = t.data.token1.amount;
        this.poolId = t.data.poolId;
        this.poolFee = t.data.poolFee;
    }
    to() {
        return {
            strategyId: this.strategyId,
            hash: this.hash,
            block: this.block,
            type: this.type,
            wallet: this.wallet,
            data: {
                poolId: this.poolId,
                poolFee: this.poolFee,
                token0: {
                    address: this.token0Addr,
                    amount: this.amount0,
                },
                token1: {
                    address: this.token1Addr,
                    amount: this.amount1,
                },
            },
        };
    }
};
__decorate([
    (0, typeorm_1.Column)({ type: "text" }),
    __metadata("design:type", String)
], SupplyUniswapEventModel.prototype, "token0Addr", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text" }),
    __metadata("design:type", String)
], SupplyUniswapEventModel.prototype, "amount0", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text" }),
    __metadata("design:type", String)
], SupplyUniswapEventModel.prototype, "token1Addr", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text" }),
    __metadata("design:type", String)
], SupplyUniswapEventModel.prototype, "amount1", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text" }),
    __metadata("design:type", String)
], SupplyUniswapEventModel.prototype, "poolId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text" }),
    __metadata("design:type", String)
], SupplyUniswapEventModel.prototype, "poolFee", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => model_strategy_1.SupplyUniswapStrategyModel, (strategy) => strategy.events),
    __metadata("design:type", model_strategy_1.SupplyUniswapStrategyModel)
], SupplyUniswapEventModel.prototype, "strategy", void 0);
SupplyUniswapEventModel = __decorate([
    (0, typeorm_1.Entity)({ name: "suply_uniswap_event" })
], SupplyUniswapEventModel);
exports.SupplyUniswapEventModel = SupplyUniswapEventModel;
