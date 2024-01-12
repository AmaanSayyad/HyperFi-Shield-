import { ethers, BigNumber } from "ethers";
import { EventType } from "../strategy/type";
import { SupplyAaveEvent } from "./type";

type EventRaw = [userAddr: string, amount: BigNumber];

export const toEvent = (strategyId: number, e: ethers.Event, type: EventType): SupplyAaveEvent => {
  // check args from event
  if (!e.args?.length) {
    throw new Error("couldn't create the event, err=invalid args length");
  }

  // parse event
  const [userAddr, amount] = e.args as EventRaw;

  return {
    strategyId,
    hash: e.transactionHash,
    block: e.blockNumber,
    type,
    wallet: userAddr,
    data: {
      token: {
        amount: amount.toString(),
      },
    },
  };
};
