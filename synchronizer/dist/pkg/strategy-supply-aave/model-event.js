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
exports.SupplyAaveEventModel = void 0;
const typeorm_1 = require("typeorm");
const model_event_1 = require("../strategy/model-event");
const model_strategy_1 = require("./model-strategy");
let SupplyAaveEventModel = class SupplyAaveEventModel extends model_event_1.EventModel {
    from(t) {
        this.strategyId = t.strategyId;
        this.hash = t.hash;
        this.block = t.block;
        this.type = t.type;
        this.wallet = t.wallet;
        this.amount = t.data.token.amount;
    }
    to() {
        return {
            id: this.id,
            strategyId: this.strategyId,
            hash: this.hash,
            block: this.block,
            type: this.type,
            wallet: this.wallet,
            createdAt: this.createdAt.getTime(),
            data: {
                token: {
                    amount: this.amount,
                },
            },
        };
    }
};
__decorate([
    (0, typeorm_1.Column)({
        type: "text",
    }),
    __metadata("design:type", String)
], SupplyAaveEventModel.prototype, "amount", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => model_strategy_1.SupplyAaveStrategyModel, (strategy) => strategy.events),
    __metadata("design:type", model_strategy_1.SupplyAaveStrategyModel)
], SupplyAaveEventModel.prototype, "strategy", void 0);
SupplyAaveEventModel = __decorate([
    (0, typeorm_1.Entity)({
        name: "supply_aave_event",
    })
], SupplyAaveEventModel);
exports.SupplyAaveEventModel = SupplyAaveEventModel;
