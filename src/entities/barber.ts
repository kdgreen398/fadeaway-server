import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from "typeorm";
import { Appointment } from "./appointment";
import { BarberImage } from "./barber-image";
import { BusinessHours } from "./business-hours";
import { Review } from "./review";
import { Service } from "./service";

@Entity()
@Unique(["email"])
export class Barber extends BaseEntity {
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

  @OneToMany(() => Appointment, (appointment) => appointment.barber)
  appointments!: Appointment[];

  @OneToMany(() => BusinessHours, (operatingHours) => operatingHours.barber)
  businessHours!: BusinessHours[];
}
