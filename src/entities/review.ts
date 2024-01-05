import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Barber } from "./barber";
import { Client } from "./client";

@Entity()
export class Review {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  rating!: number;

  @Column()
  description!: string;

  @Column()
  dateCreated!: Date;

  @ManyToOne(() => Barber, (barber) => barber.reviews)
  @JoinColumn()
  barber!: Barber;

  @ManyToOne(() => Client, (client) => client.reviews)
  @JoinColumn()
  client!: Client;
}
