import { Column, Entity, PrimaryGeneratedColumn, Unique } from "typeorm";

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
