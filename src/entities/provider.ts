import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from "typeorm";
import { Appointment } from "./appointment";
import { BusinessHours } from "./business-hours";
import { ProviderImage } from "./provider-image";
import { Review } from "./review";
import { Service } from "./service";

@Entity()
@Unique(["email"])
export class Provider extends BaseEntity {
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

  @OneToMany(() => ProviderImage, (image) => image.provider)
  images!: ProviderImage[];

  @OneToMany(() => Review, (review) => review.provider)
  reviews!: Review[];

  @OneToMany(() => Service, (service) => service.provider)
  services!: Service[];

  @OneToMany(() => Appointment, (appointment) => appointment.provider)
  appointments!: Appointment[];

  @OneToMany(() => BusinessHours, (operatingHours) => operatingHours.provider)
  businessHours!: BusinessHours[];
}
