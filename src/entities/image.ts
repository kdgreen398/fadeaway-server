import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { ImageTypeEnum } from "../enums/image-type-enum";
import { Provider } from "./provider";
import { Service } from "./service";

@Entity()
export class Image extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  url!: string;

  @Column()
  fileName!: string;

  @Column({
    type: "enum",
    enum: ImageTypeEnum,
  })
  imageType!: ImageTypeEnum;

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
