import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Barber } from "./barber";

@Entity()
export class BarberImage extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  url!: string;

  @ManyToOne(() => Barber, (barber) => barber.images, {
    onDelete: "CASCADE",
  })
  @JoinColumn()
  barber!: Barber;
}
