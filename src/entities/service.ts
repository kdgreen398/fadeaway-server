import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Barber } from "./barber";

@Entity()
export class Service {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  description!: string;

  @Column()
  hours!: number;

  @Column()
  minutes!: number;

  @Column()
  price!: number;

  @ManyToOne(() => Barber, (barber) => barber.services)
  barber!: Barber;

  static create(
    name: string,
    description: string,
    hours: number,
    minutes: number,
    price: number,
    barber: Barber,
  ) {
    const service = new Service();
    service.name = name;
    service.description = description;
    service.hours = hours;
    service.minutes = minutes;
    service.price = price;
    service.barber = barber;

    return service;
  }
}
