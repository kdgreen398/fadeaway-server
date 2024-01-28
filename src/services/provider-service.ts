import { In } from "typeorm";
import { Appointment } from "../entities/appointment";
import { Provider } from "../entities/provider";
import { AppointmentStatusEnum } from "../enums/appointment-status-enum";
import { ImageTypeEnum } from "../enums/image-type-enum";
import { AppDataSource } from "../util/data-source";
import logger from "../util/logger";
import * as ImageService from "./image-service";

const formatAddress = (provider: Provider) =>
  `${provider.addressLine1}${
    provider.addressLine2 ? " " + provider.addressLine2 : ""
  }, ${provider.city}, ${provider.state} ${provider.zipCode}`;

const getFullName = (provider: Provider) =>
  `${provider.firstName} ${provider.lastName}`.trim();

export async function getProvidersByCityState(city: string, state: string) {
  logger.info("Entering Provider Service => getProvidersByCityState");

  const providers = await AppDataSource.manager.find(Provider, {
    where: { city, state },
    relations: {
      images: true,
      reviews: true,
    },
  });

  logger.info("Exiting Provider Service => getProvidersByCityState");
  return providers;
}

export async function getProviderProfileData(username: string) {
  logger.info("provider-service => getProviderProfileData");

  const provider = await AppDataSource.manager.findOne(Provider, {
    where: { username },
    relations: {
      images: true,
      reviews: true,
      services: true,
      businessHours: true,
    },
  });

  if (!provider) {
    throw new Error("Provider does not exist");
  }

  return {
    ...provider,
    formattedAddress: formatAddress(provider),
    fullName: getFullName(provider),
  };
}

export async function updateProviderProfileData(
  providerToSave: Provider,
  profileImage: Express.Multer.File | undefined,
) {
  logger.info("provider-service => updateProviderProfileData");

  const provider = await AppDataSource.manager.findOne(Provider, {
    where: { id: providerToSave.id },
  });

  if (!provider) {
    throw new Error("Provider does not exist");
  }

  if (profileImage) {
    // delete existing profile image
    if (provider.profileImage) {
      await ImageService.deleteImage(provider.id, provider.profileImage);
    }

    // upload new profile image
    provider.profileImage = await ImageService.uploadImage(
      profileImage,
      ImageTypeEnum.profile,
      provider.id,
      null,
    );
  }

  provider.firstName = providerToSave.firstName;
  provider.lastName = providerToSave.lastName;
  provider.alias = providerToSave.alias;
  provider.bio = providerToSave.bio;
  provider.shop = providerToSave.shop;
  provider.addressLine1 = providerToSave.addressLine1;
  provider.addressLine2 = providerToSave.addressLine2;
  provider.city = providerToSave.city;
  provider.state = providerToSave.state;
  provider.zipCode = providerToSave.zipCode;

  const updatedProvider = await AppDataSource.manager.save(provider);

  return {
    ...updatedProvider,
    formattedAddress: formatAddress(updatedProvider),
    fullName: getFullName(updatedProvider),
  };
}

export async function deleteProviderAccount(providerId: number) {
  logger.info("provider-service => deleteProviderAccount");

  const provider = await AppDataSource.manager.findOne(Provider, {
    where: { id: providerId },
    relations: {
      images: true,
    },
  });

  if (!provider) {
    throw new Error("Provider does not exist");
  }

  // check if provider has any appointments in pending or accepted state
  const appointments = await AppDataSource.manager.find(Appointment, {
    where: {
      provider: {
        id: providerId,
      },
      status: In([
        AppointmentStatusEnum.ACCEPTED,
        AppointmentStatusEnum.PENDING,
      ]),
    },
  });

  if (appointments.length > 0) {
    throw new Error(
      "Provider cannot delete account while having appointments in pending or accepted state",
    );
  }

  // delete provider profile and other images from storage
  const promises = provider.images.map((image) =>
    ImageService.deleteImage(provider.id, image),
  );

  await Promise.all(promises);

  await AppDataSource.manager.delete(Provider, providerId);
}
