import { TokenSymbol } from "../../synchronizer";
import { StrategyModel } from "../strategy/model-strategy";
import { SupplyAaveEventModel } from "./model-event";
import { SupplyAaveStrategy } from "./type";
export declare class SupplyAaveStrategyModel extends StrategyModel {
    symbol: TokenSymbol;
    address: string;
    dataFeedAddr: string;
    dataFeedFactor: string;
    events: SupplyAaveEventModel[];
    from(s: SupplyAaveStrategy): void;
    to(): SupplyAaveStrategy;
}
