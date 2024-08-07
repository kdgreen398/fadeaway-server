import { BusinessHours } from "../entities/business-hours";
import { Provider } from "../entities/provider";
import { AppDataSource } from "../util/data-source";
import logger from "../util/logger";

function removeDuplicates(data: BusinessHours[]) {
  const uniqueDays = Array.from(new Set(data.map((item) => item.day)));
  return data.filter((item) => {
    if (uniqueDays.includes(item.day)) {
      const index = uniqueDays.indexOf(item.day);
      uniqueDays.splice(index, 1);
      return true;
    }
    return false;
  });
}

export async function updateBusinessHours(
  providerId: number,
  dataToCreate: BusinessHours[],
) {
  logger.info("business-hours-service => updateBusinessHours");
  const provider = await AppDataSource.manager.findOne(Provider, {
    where: { id: providerId },
    relations: {
      businessHours: true,
    },
  });

  if (!provider) {
    throw new Error("Provider not found");
  }

  const createdBusinessHours = removeDuplicates(dataToCreate).map((data) => {
    const { day, startTime, endTime, isClosed } = data;

    // check if business hours already exist for this day
    const dataInDB = provider.businessHours.find((hours) => hours.day === day);

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
        provider,
      });
    }
  });

  return await AppDataSource.manager.save(createdBusinessHours);
}
