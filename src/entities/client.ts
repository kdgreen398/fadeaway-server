import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from "typeorm";
import { Review } from "./review";

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
