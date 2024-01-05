import { Barber } from "../entities/barber";
import { AppDataSource } from "../util/data-source";
import logger from "../util/logger";
// import ServiceManagementService from "./service-management-service";

const formatAddress = (barber: Barber) =>
  `${barber.addressLine1}${
    barber.addressLine2 ? " " + barber.addressLine2 : ""
  }, ${barber.city}, ${barber.state} ${barber.zipCode}`;

const getFullName = (barber: Barber) =>
  `${barber.firstName} ${barber.lastName}`.trim();

export async function getBarbersByCityState(city: string, state: string) {
  logger.info("Entering Barber Service => getBarbersByCityState");

  const barbers = await AppDataSource.manager.find(Barber, {
    where: { city, state },
    relations: {
      images: true,
      reviews: true,
    },
  });

  logger.info("Exiting Barber Service => getBarbersByCityState");
  return barbers;
}

// async function getFullBarberDetailsById(barberId: number) {
//   logger.info("Entering Barber Service => getBarberDetails");
//   const barber = (
//     await executeSelectQuery(FETCH_BARBER_DETAILS_BY_PUBLIC_ID, [publicId])
//   )[0];

//   if (!barber) return null;

//   const imageQuery = FETCH_IMAGES_BY_BARBER_ID;
//   const reviewQuery = FETCH_REVIEWS_BY_BARBER_ID;

//   const [images, reviews, services] = await Promise.all([
//     executeSelectQuery(imageQuery, [barber.barberId]),
//     executeSelectQuery(reviewQuery, [barber.barberId]),
//     ServiceManagementService.getServices(barber.barberId),
//   ]);

//   logger.info("Exiting Barber Service => getBarberDetails");
//   return {
//     ...barber,
//     formattedAddress: formatAddress(barber),
//     fullName: getFullName(barber),
//     images,
//     reviews,
//     services,
//   };
// }

// async function updateBarberDetails(
//   barberId,
//   firstName,
//   lastName,
//   alias,
//   bio,
//   shop,
//   addressLine1,
//   addressLine2,
//   city,
//   state,
//   zipCode,
// ) {
//   logger.info("Entering Barber Service => updateBarberDetails");
//   const [barber] = await executeSelectQuery(FETCH_BARBER_DETAILS_BY_BARBER_ID, [
//     barberId,
//   ]);

//   if (!barber) {
//     throw new Error("Barber does not exist");
//   }

//   await executeNonSelectQuery(UPDATE_BARBER_DETAILS, [
//     firstName,
//     lastName,
//     alias || null,
//     shop,
//     bio || null,
//     addressLine1,
//     addressLine2 || null,
//     city,
//     state,
//     zipCode,
//     barberId,
//   ]);

//   const [updatedBarberDetails] = await executeSelectQuery(
//     FETCH_BARBER_DETAILS_BY_BARBER_ID,
//     [barberId],
//   );

//   logger.info("Exiting Barber Service => updateBarberDetails");
//   return {
//     ...updatedBarberDetails,
//     formattedAddress: formatAddress(updatedBarberDetails),
//     fullName: getFullName(updatedBarberDetails),
//   };
// }
