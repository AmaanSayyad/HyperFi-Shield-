import { EventModel } from "../strategy/model-event";
import { SupplyUniswapStrategyModel } from "./model-strategy";
import { SupplyUniswapEvent } from "./type";
export declare class SupplyUniswapEventModel extends EventModel {
    token0Addr: string;
    amount0: string;
    token1Addr: string;
    amount1: string;
    poolId: string;
    poolFee: string;
    strategy: SupplyUniswapStrategyModel;
    from(t: SupplyUniswapEvent): void;
    to(): SupplyUniswapEvent;
}
