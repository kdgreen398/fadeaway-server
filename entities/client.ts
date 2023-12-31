import { Column, Entity } from "typeorm";

@Entity()
export class Client {
  id!: number;

  @Column()
  firstName!: string;

  @Column()
  lastName!: string;

  @Column()
  isActive!: boolean;
}
