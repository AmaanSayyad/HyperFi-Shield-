import { Network } from "../../synchronizer";
import { StrategyType } from "./type";
export declare class StrategyModel {
    id: number;
    name: string;
    type: StrategyType;
    network: Network;
    contract: string;
}
