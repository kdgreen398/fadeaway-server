import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Appointment } from "./appointment";
import { BusinessHours } from "./business-hours";
import { Image } from "./image";
import { Review } from "./review";
import { Service } from "./service";

@Entity()
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

  @Column({ unique: true })
  email!: string;

  @Column({ unique: true })
  username!: string;

  @Column({ select: false })
  password!: string;

  @OneToOne(() => Image, (image) => image.provider, {
    onDelete: "SET NULL",
    eager: true,
  })
  @JoinColumn()
  profileImage!: Image;

  @OneToMany(() => Image, (image) => image.provider)
  images!: Image[];

  @OneToMany(() => Review, (review) => review.provider)
  reviews!: Review[];

  @OneToMany(() => Service, (service) => service.provider)
  services!: Service[];

  @OneToMany(() => Appointment, (appointment) => appointment.provider)
  appointments!: Appointment[];

  @OneToMany(() => BusinessHours, (operatingHours) => operatingHours.provider)
  businessHours!: BusinessHours[];
}
