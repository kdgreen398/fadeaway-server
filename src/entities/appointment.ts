import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { AppointmentStatusEnum } from "../enums/appointment-status-enum";
import { RoleEnum } from "../enums/role-enum";
import { Provider } from "./barber";
import { Client } from "./client";

@Entity()
export class Appointment extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    type: "enum",
    enum: AppointmentStatusEnum,
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

  @ManyToOne(() => Provider, (barber) => barber.appointments, {
    onDelete: "CASCADE",
    eager: true,
  })
  barber!: Provider;

  @ManyToOne(() => Client, (client) => client.appointments, {
    onDelete: "CASCADE",
    eager: true,
  })
  client!: Client;
}
