import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Review } from "./review";
import { AppointmentStatuses } from "../enums/appointment-status-enum";
import { RoleEnum } from "../enums/role-enum";
import { Barber } from "./barber";
import { Client } from "./client";

@Entity()
export class Appointment {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    type: "enum",
    enum: AppointmentStatuses,
  })
  status!: string;

  @Column()
  startTime!: Date;

  @Column()
  endTime!: Date;

  @Column()
  services!: JSON;

  @Column({
    type: "enum",
    enum: RoleEnum,
  })
  updatedBy!: string; // barber or client

  @Column()
  updatedTime!: Date;

  @ManyToOne(() => Barber, (barber) => barber.appointments)
  barber!: Barber;

  @ManyToOne(() => Client, (client) => client.appointments)
  client!: Barber;
}
