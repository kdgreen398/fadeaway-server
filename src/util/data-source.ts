import { DataSource } from "typeorm";
import { SnakeNamingStrategy } from "typeorm-naming-strategies";
import { Client } from "../entities/client";
import { Image } from "../entities/image";
import { Provider } from "../entities/provider";
import { Review } from "../entities/review";
import { Service } from "../entities/service";
import { createAppointment } from "../services/appointment-service";
import {
  createClientInDB,
  createProviderInDB,
} from "../services/registration-service";

export const AppDataSource = new DataSource({
  type: "mysql",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: "app-data",
  synchronize: true,
  namingStrategy: new SnakeNamingStrategy(),
  entities: ["src/entities/*.ts"],
  // logging: true,
  // dropSchema: true,
});

AppDataSource.initialize()
  .then(() => {
    console.log("Data Source has been initialized!");
  })
  .catch((err: any) => {
    console.error("Error during Data Source initialization", err);
    throw err;
  });
