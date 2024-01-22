import { Provider } from "../entities/barber";
import { BusinessHours } from "../entities/business-hours";
import { AppDataSource } from "../util/data-source";

export async function createBusinessHours(
  barberId: number,
  dataToCreate: BusinessHours[],
) {
  const barber = await AppDataSource.manager.findOne(Provider, {
    where: { id: barberId },
    relations: {
      businessHours: true,
    },
  });

  if (!barber) {
    throw new Error("Provider not found");
  }

  const createdBusinessHours = dataToCreate.map((data) => {
    const { day, startTime, endTime, isClosed } = data;

    // check if business hours already exist for this day
    const dataInDB = barber.businessHours.find((hours) => hours.day === day);

    // if business hours already exist for this day, update them
    if (dataInDB) {
      dataInDB.startTime = isClosed ? null : startTime;
      dataInDB.endTime = isClosed ? null : endTime;
      dataInDB.isClosed = isClosed;
      return dataInDB;
    } else {
      return BusinessHours.create({
        day,
        startTime: isClosed ? null : startTime,
        endTime: isClosed ? null : endTime,
        isClosed,
        barber,
      });
    }
  });

  return await AppDataSource.manager.save(createdBusinessHours);
}
