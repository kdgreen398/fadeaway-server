import {
  BaseEntity,
  Column,
  Entity,
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

  @Column({ nullable: true })
  description!: string;

  @Column()
  dateCreated!: Date;

  @ManyToOne(() => Provider, (provider) => provider.reviews, {
    onDelete: "CASCADE",
  })
  provider!: Provider;

  @ManyToOne(() => Client, {
    eager: true,
    onDelete: "CASCADE",
  })
  client!: Client;
}
