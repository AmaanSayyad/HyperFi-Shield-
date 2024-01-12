import { ethers } from "ethers";
import { EventType } from "../strategy/type";
import { SupplyAaveEvent } from "./type";
export declare const toEvent: (strategyId: number, e: ethers.Event, type: EventType) => SupplyAaveEvent;
