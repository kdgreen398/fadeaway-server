import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Barber } from "./barber";
import { Client } from "./client";

@Entity()
export class Review extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  rating!: number;

  @Column()
  description!: string;

  @Column()
  dateCreated!: Date;

  @ManyToOne(() => Barber, (barber) => barber.reviews, {
    onDelete: "CASCADE",
  })
  @JoinColumn()
  barber!: Barber;

  @ManyToOne(() => Client, (client) => client.reviews, {
    eager: true,
    onDelete: "CASCADE",
  })
  @JoinColumn()
  client!: Client;
}
