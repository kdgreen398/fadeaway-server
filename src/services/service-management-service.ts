import { Provider } from "../entities/provider";
import { Service } from "../entities/service";
import { AppDataSource } from "../util/data-source";
import logger from "../util/logger";

export async function createService(
  name: string,
  hours: number,
  minutes: number,
  description: string,
  price: number,
  providerId: number,
) {
  logger.info("service-management-service => createService");

  // if user has more than 6 services, throw error
  // const [{ serviceCount }] = await executeSelectQuery(
  //   FETCH_SERVICE_COUNT_BY_BARBER_ID,
  //   [providerId],
  // );

  // if (serviceCount >= 6) {
  //   throw new Error("You have reached the maximum number of services");
  // }

  const provider = await AppDataSource.manager.findOne(Provider, {
    where: {
      id: providerId,
    },
  });

  if (!provider) {
    throw new Error("Provider does not exist");
  }

  const createdService = await AppDataSource.manager.save(
    Service.create({ name, description, hours, minutes, price, provider }),
  );

  return createdService;
}

export async function updateService(
  name: string,
  hours: number,
  minutes: number,
  description: string,
  price: number,
  serviceId: number,
  providerId: number,
) {
  logger.info("service-management-service => updateService");

  const service = await AppDataSource.manager.findOne(Service, {
    where: {
      id: serviceId,
      provider: {
        id: providerId,
      },
    },
  });

  if (!service) {
    throw new Error("Service does not exist");
  }

  service.name = name;
  service.hours = hours;
  service.minutes = minutes;
  service.description = description;
  service.price = price;

  const updatedService = await AppDataSource.manager.save(service);

  return updatedService;
}

export async function deleteService(serviceId: number, providerId: number) {
  logger.info("service-management-service => deleteService");

  const service = await AppDataSource.manager.findOne(Service, {
    where: {
      id: serviceId,
      provider: {
        id: providerId,
      },
    },
  });

  if (!service) {
    throw new Error("Service does not exist");
  }

  await AppDataSource.manager.delete(Service, serviceId);

  return "Service deleted successfully";
}

module.exports = {
  createService,
  updateService,
  deleteService,
};
