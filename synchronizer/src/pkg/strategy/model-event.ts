import { Entity, Column, CreateDateColumn, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { EventType } from "./type";

@Entity()
export abstract class EventModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  strategyId: number;

  @Column({
    unique: true,
  })
  hash: string;

  @Column()
  block: number;

  @Column({
    type: "enum",
    enum: EventType,
  })
  type: EventType;

  @Column()
  wallet: string;

  @CreateDateColumn()
  createdAt: Date;
}
