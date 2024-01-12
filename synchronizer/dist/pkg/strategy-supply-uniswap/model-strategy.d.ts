import { TokenSymbol } from "../../synchronizer";
import { StrategyModel } from "../strategy/model-strategy";
import { SupplyUniswapEventModel } from "./model-event";
import { SupplyUniswapStrategy } from "./type";
export declare class SupplyUniswapStrategyModel extends StrategyModel {
    poolId: string;
    token0Symbol: TokenSymbol;
    token0Addr: string;
    token0DataFeedAddr: string;
    token0DataFeedFactor: string;
    token1Symbol: TokenSymbol;
    token1Addr: string;
    token1DataFeedAddr: string;
    token1DataFeedFactor: string;
    poolFee: string;
    events: SupplyUniswapEventModel;
    from(s: SupplyUniswapStrategy): void;
    to(): SupplyUniswapStrategy;
}
