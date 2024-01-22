import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Provider } from "./barber";

@Entity()
export class Service extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  description!: string;

  @Column()
  hours!: number;

  @Column()
  minutes!: number;

  @Column()
  price!: number;

  @ManyToOne(() => Provider, (barber) => barber.services, {
    onDelete: "CASCADE",
  })
  barber!: Provider;
}
