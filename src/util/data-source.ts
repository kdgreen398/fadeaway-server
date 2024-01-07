import { DataSource } from "typeorm";
import { SnakeNamingStrategy } from "typeorm-naming-strategies";
import { Barber } from "../entities/barber";
import { BarberImage } from "../entities/barber-image";
import { Client } from "../entities/client";
import {
  createBarberInDB,
  createClientInDB,
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
  dropSchema: true,
});

AppDataSource.initialize()
  .then(() => {
    console.log("Data Source has been initialized!");
    createTestData();
  })
  .catch((err: any) => {
    console.error("Error during Data Source initialization", err);
    throw err;
  });

const createTestData = async () => {
  // create some test data
  const barber = Barber.create({
    firstName: "John",
    lastName: "Doe",
    // alias: "Johnny",
    shop: "John's Barber Shop",
    bio: "I'm a barber",
    addressLine1: "123 Main St",
    addressLine2: "Suite 100",
    city: "Murfreesboro",
    state: "TN",
    zipCode: "92101",
    email: "john.doe@example.com",
    password: "password",
    profileImage: "https://picsum.photos/300/300",
  });

  await createBarberInDB(barber);

  const images = [];

  for (let i = 1; i < 10; i++) {
    images.push(
      BarberImage.create({
        barber,
        url: `https://picsum.photos/30${i}/30${i}`,
      }),
    );
  }

  AppDataSource.manager.save(images);

  const client = Client.create({
    firstName: "Jane",
    lastName: "Doe",
    email: "jane.doe@example.com",
    password: "password",
  });
  createClientInDB(client);
};
