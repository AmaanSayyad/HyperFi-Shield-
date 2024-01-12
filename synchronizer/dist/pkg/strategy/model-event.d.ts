import { EventType } from "./type";
export declare abstract class EventModel {
    id: number;
    strategyId: number;
    hash: string;
    block: number;
    type: EventType;
    wallet: string;
    createdAt: Date;
}
