import { DataSource } from "typeorm";
import { SnakeNamingStrategy } from "typeorm-naming-strategies";
import { Barber } from "../entities/barber";
import { BarberImage } from "../entities/barber-image";
import { Client } from "../entities/client";
import { Review } from "../entities/review";
import { Service } from "../entities/service";
import { createAppointment } from "../services/appointment-service";
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

  const barber = await createBarberInDB(
    Barber.create({
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
      profileImage:
        "https://images.unsplash.com/photo-1567894340315-735d7c361db0?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGJhcmJlcnxlbnwwfHwwfHx8MA%3D%3D",
      // "https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YmFyYmVyfGVufDB8fDB8fHww",
    }),
  );

  const images = [];

  for (let i = 1; i < 10; i++) {
    images.push(
      BarberImage.create({
        barber,
        url: `https://picsum.photos/30${i}/30${i}`,
      }),
    );
  }

  await AppDataSource.manager.save(images);

  const client = await createClientInDB(
    Client.create({
      firstName: "Jane",
      lastName: "Doe",
      email: "jane.doe@example.com",
      password: "password",
    }),
  );

  const services = [];
  for (let i = 0; i < 10; i++) {
    services.push(
      Service.create({
        name: `Service ${i}`,
        description: `Service ${i} description`,
        hours: i,
        minutes: i,
        price: i * 10,
        barber,
      }),
    );
  }

  await AppDataSource.manager.save(services);

  await createAppointment(client.email, barber.email, new Date("2024-01-29"), [
    services[0],
    services[1],
  ]);

  const reviews = [];
  for (let i = 1; i < 5; i++) {
    reviews.push(
      Review.create({
        rating: Math.floor(Math.random() * 5) + 1,
        description: "lorem ipsum dolor sit amet",
        dateCreated: new Date(
          new Date().getTime() -
            Math.random() * (10000000000 - 1000000) +
            1000000,
        ),
        barber,
        client,
      }),
    );
  }

  await AppDataSource.manager.save(reviews);

  console.log("Test data created!");
};
