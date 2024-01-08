import { BaseEntity, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class BarberCityState extends BaseEntity {
  @PrimaryColumn()
  city!: string;

  @PrimaryColumn()
  state!: string;
}
