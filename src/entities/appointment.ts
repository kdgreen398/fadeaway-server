import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { AppointmentStatusEnum } from "../enums/appointment-status-enum";
import { RoleEnum } from "../enums/role-enum";
import { Client } from "./client";
import { Provider } from "./provider";

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
  updatedBy!: string; // provider or client

  @Column()
  updatedTime!: Date;

  @ManyToOne(() => Provider, (provider) => provider.appointments, {
    onDelete: "CASCADE",
    eager: true,
  })
  provider!: Provider;

  @ManyToOne(() => Client, (client) => client.appointments, {
    onDelete: "CASCADE",
    eager: true,
  })
  client!: Client;
}
