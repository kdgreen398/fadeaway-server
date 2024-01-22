import { BaseEntity, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class ProviderCityState extends BaseEntity {
  @PrimaryColumn()
  city!: string;

  @PrimaryColumn()
  state!: string;
}
