import { ethers, BigNumber } from "ethers";
import { EventType } from "../strategy/type";
import { SupplyUniswapEvent } from "./type";

type EventRaw = [
  userAddr: string,
  poolId: BigNumber,
  token0Addr: string,
  token1Addr: string,
  amount0: BigNumber,
  amount1: BigNumber,
  poolFee: BigNumber
];

export const toEvent = (strategyId: number, e: ethers.Event, type: EventType): SupplyUniswapEvent => {
  // check args from event
  if (!e.args?.length) {
    throw new Error("couldn't create the event, err=invalid args length");
  }

  // parse event
  const [userAddr, poolId, token0Addr, token1Addr, amount0, amount1, poolFee] = e.args as EventRaw;

  return {
    strategyId,
    hash: e.transactionHash,
    block: e.blockNumber,
    type,
    wallet: userAddr,
    data: {
      poolId: poolId.toString(),
      poolFee: poolFee.toString(),
      token0: {
        address: token0Addr,
        amount: amount0.toString(),
      },
      token1: {
        address: token1Addr,
        amount: amount1.toString(),
      },
    },
  };
};
