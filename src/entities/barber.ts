import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
  OneToMany,
} from "typeorm";
import { BarberImage } from "./barber-image";
import { Review } from "./review";
import { Service } from "./service";

@Entity()
@Unique(["email"])
export class Barber {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  firstName!: string;

  @Column()
  lastName!: string;

  @Column({ nullable: true })
  alias!: string;

  @Column({ nullable: true })
  shop!: string;

  @Column({ type: "text", nullable: true })
  bio!: string;

  @Column()
  addressLine1!: string;

  @Column({ nullable: true })
  addressLine2!: string;

  @Column()
  city!: string;

  @Column()
  state!: string;

  @Column()
  zipCode!: string;

  @Column()
  email!: string;

  @Column()
  password!: string;

  @Column({ nullable: true })
  profileImage!: string;

  @OneToMany(() => BarberImage, (image) => image.barber)
  images!: BarberImage[];

  @OneToMany(() => Review, (review) => review.barber)
  reviews!: Review[];

  @OneToMany(() => Service, (service) => service.barber)
  services!: Service[];

  static create(
    firstName: string,
    lastName: string,
    email: string,
    hashedPassword: string,
    shop: string,
    addressLine1: string,
    addressLine2: string,
    city: string,
    state: string,
    zipCode: string,
  ) {
    const barber = new Barber();
    barber.firstName = firstName;
    barber.lastName = lastName;
    barber.email = email;
    barber.password = hashedPassword;
    barber.shop = shop;
    barber.addressLine1 = addressLine1;
    barber.addressLine2 = addressLine2;
    barber.city = city;
    barber.state = state;
    barber.zipCode = zipCode;
    return barber;
  }
}
