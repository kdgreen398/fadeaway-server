import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from "typeorm";
import { Appointment } from "./appointment";
import { Review } from "./review";

@Entity()
@Unique(["email"])
export class Client extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  firstName!: string;

  @Column()
  lastName!: string;

  @Column()
  email!: string;

  @Column()
  password!: string;

  @OneToMany(() => Review, (review) => review.provider)
  reviews!: Review[];

  @OneToMany(() => Appointment, (appointment) => appointment.client)
  appointments!: Appointment[];
}
