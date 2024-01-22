import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Client } from "./client";
import { Provider } from "./provider";

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

  @ManyToOne(() => Provider, (provider) => provider.reviews, {
    onDelete: "CASCADE",
  })
  @JoinColumn()
  provider!: Provider;

  @ManyToOne(() => Client, {
    eager: true,
    onDelete: "CASCADE",
  })
  @JoinColumn()
  client!: Client;
}
