import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Provider } from "./provider";

@Entity()
export class Service extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column({ nullable: true })
  description!: string;

  @Column()
  hours!: number;

  @Column()
  minutes!: number;

  @Column()
  price!: number;

  @ManyToOne(() => Provider, (provider) => provider.services, {
    onDelete: "CASCADE",
  })
  provider!: Provider;
}
