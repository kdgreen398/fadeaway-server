import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Appointment } from "./appointment";
import { Review } from "./review";

@Entity()
export class Client extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  firstName!: string;

  @Column()
  lastName!: string;

  @Column({ unique: true })
  email!: string;

  @Column({ select: false })
  password!: string;

  @OneToMany(() => Review, (review) => review.provider)
  reviews!: Review[];

  @OneToMany(() => Appointment, (appointment) => appointment.client)
  appointments!: Appointment[];
}
