import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Barber } from "./barber";

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

  @ManyToOne(() => Barber, (barber) => barber.services)
  barber!: Barber;
}
