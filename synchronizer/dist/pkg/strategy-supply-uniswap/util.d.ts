import { ethers } from "ethers";
import { EventType } from "../strategy/type";
import { SupplyUniswapEvent } from "./type";
export declare const toEvent: (strategyId: number, e: ethers.Event, type: EventType) => SupplyUniswapEvent;
