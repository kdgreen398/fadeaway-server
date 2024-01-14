import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { DayOfTheWeekEnum } from "../enums/day-of-the-week-enum";
import { Barber } from "./barber";

@Entity()
export class BusinessHours {
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

  @ManyToOne(() => Barber, (barber) => barber.businessHours, {
    onDelete: "CASCADE",
  })
  barber!: Barber;
}
