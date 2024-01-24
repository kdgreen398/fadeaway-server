import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Image } from "./image";
import { Provider } from "./provider";

@Entity()
export class Service extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column({ nullable: true })
  description!: string;

  @Column()
  hours!: number;

  @Column()
  minutes!: number;

  @Column()
  price!: number;

  @ManyToOne(() => Provider, (provider) => provider.services, {
    onDelete: "CASCADE",
    nullable: false,
  })
  provider!: Provider;

  @OneToMany(() => Image, (image) => image.service)
  images!: Image[];
}
