import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Barber } from "./barber";

@Entity()
export class BarberImage {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  url!: string;

  @ManyToOne(() => Barber, (barber) => barber.images)
  @JoinColumn()
  barber!: Barber;
}
