import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { AppointmentStatuses } from "../enums/appointment-status-enum";
import { RoleEnum } from "../enums/role-enum";
import { Barber } from "./barber";
import { Client } from "./client";

@Entity()
export class Appointment extends BaseEntity {
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

  @Column("json")
  services!: any;

  @Column()
  createdTime!: Date;

  @Column({
    type: "enum",
    enum: RoleEnum,
  })
  updatedBy!: string; // barber or client

  @Column()
  updatedTime!: Date;

  @ManyToOne(() => Barber, (barber) => barber.appointments, {
    onDelete: "CASCADE",
  })
  barber!: Barber;

  @ManyToOne(() => Client, (client) => client.appointments, {
    onDelete: "CASCADE",
  })
  client!: Client;
}
