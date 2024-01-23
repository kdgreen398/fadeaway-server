import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { ProviderImageTypeEnum } from "../enums/provider-image-type-enum";
import { Provider } from "./provider";
import { Service } from "./service";

@Entity()
export class ProviderImage extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  url!: string;

  @Column()
  fileName!: string;

  @Column({
    type: "enum",
    enum: ProviderImageTypeEnum,
  })
  imageType!: ProviderImageTypeEnum;

  @ManyToOne(() => Service, (service) => service.images, {
    onDelete: "SET NULL",
  })
  service!: Service | null;

  @ManyToOne(() => Provider, (provider) => provider.images, {
    onDelete: "CASCADE",
    nullable: false,
  })
  @JoinColumn()
  provider!: Provider;
}
