import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Provider } from "./provider";

@Entity()
export class ProviderImage extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  url!: string;

  @Column()
  fileName!: string;

  @ManyToOne(() => Provider, (provider) => provider.images, {
    onDelete: "CASCADE",
  })
  @JoinColumn()
  provider!: Provider;
}
