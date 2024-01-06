import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
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

  @Column("json")
  services!: any;

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
  client!: Client;

  static create(
    startTime: Date,
    endTime: Date,
    services: any,
    updatedBy: string,
    updatedTime: Date,
    barber: Barber,
    client: Client,
  ) {
    const appointment = new Appointment();
    appointment.startTime = startTime;
    appointment.endTime = endTime;
    appointment.services = services;
    appointment.updatedBy = updatedBy;
    appointment.updatedTime = updatedTime;
    appointment.barber = barber;
    appointment.client = client;
    return appointment;
  }
}
