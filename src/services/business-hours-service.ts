import { Barber } from "../entities/barber";
import { BusinessHours } from "../entities/business-hours";
import { AppDataSource } from "../util/data-source";

export async function createBusinessHours(
  barberId: number,
  dataToCreate: BusinessHours,
) {
  const barber = await AppDataSource.manager.findOne(Barber, {
    where: { id: barberId },
    relations: {
      businessHours: true,
    },
  });

  if (!barber) {
    throw new Error("Barber not found");
  }

  const { day, startTime, endTime, isClosed } = dataToCreate;

  // check if operating hours already exist for this day
  const operatingHours = barber.businessHours.find(
    (hours) => hours.day === dataToCreate.day,
  );

  // if operating hours already exist for this day, update them
  if (operatingHours) {
    operatingHours.startTime = isClosed ? null : startTime;
    operatingHours.endTime = isClosed ? null : endTime;
    operatingHours.isClosed = isClosed;
    return await AppDataSource.manager.save(operatingHours);
  } else {
    const newBusinessHours = AppDataSource.manager.create(BusinessHours, {
      day,
      startTime: isClosed ? null : startTime,
      endTime: isClosed ? null : endTime,
      isClosed,
      barber,
    });

    return await AppDataSource.manager.save(newBusinessHours);
  }
}
