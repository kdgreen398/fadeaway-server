import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from "typeorm";
import { Review } from "./review";
import { Appointment } from "./appointment";

@Entity()
@Unique(["email"])
export class Client {
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

  @OneToMany(() => Review, (review) => review.barber)
  reviews!: Review[];

  @OneToMany(() => Appointment, (appointment) => appointment.client)
  appointments!: Appointment[];

  static create(
    firstName: string,
    lastName: string,
    email: string,
    password: string,
  ) {
    const client = new Client();
    client.firstName = firstName;
    client.lastName = lastName;
    client.email = email;
    client.password = password;
    return client;
  }
}
