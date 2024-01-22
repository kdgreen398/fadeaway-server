import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { DayOfTheWeekEnum } from "../enums/day-of-the-week-enum";
import { Provider } from "./barber";

@Entity()
export class BusinessHours extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    type: "enum",
    enum: DayOfTheWeekEnum,
  })
  day!: string; // 'Monday', 'Tuesday', etc.

  @Column("time", { nullable: true })
  startTime!: string | null; // '09:00', '10:30', etc.

  @Column("time", { nullable: true })
  endTime!: string | null; // '17:00', '18:30', etc.

  @Column()
  isClosed!: boolean;

  @ManyToOne(() => Provider, (barber) => barber.businessHours, {
    onDelete: "CASCADE",
  })
  barber!: Provider;
}
