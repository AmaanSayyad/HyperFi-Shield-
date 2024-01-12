import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";
import { Network } from "../../synchronizer";
import { StrategyType } from "./type";

@Entity({
  name: "strategy",
})
export class StrategyModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "text" })
  name: string;

  @Column({ type: "text" })
  type: StrategyType;

  @Column({ type: "text" })
  network: Network;

  @Column({ type: "text" })
  contract: string;
}
