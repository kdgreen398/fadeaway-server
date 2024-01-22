import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Provider } from "./barber";
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

  @ManyToOne(() => Provider, (barber) => barber.reviews, {
    onDelete: "CASCADE",
  })
  @JoinColumn()
  barber!: Provider;

  @ManyToOne(() => Client, (client) => client.reviews, {
    eager: true,
    onDelete: "CASCADE",
  })
  @JoinColumn()
  client!: Client;
}
