import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Provider } from "./barber";

@Entity()
export class BarberImage extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  url!: string;

  @Column()
  fileName!: string;

  @ManyToOne(() => Provider, (barber) => barber.images, {
    onDelete: "CASCADE",
  })
  @JoinColumn()
  barber!: Provider;
}
