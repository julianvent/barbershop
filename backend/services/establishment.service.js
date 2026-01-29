import { EstablishmentRepository } from "../repositories/establishment.repository.js";
import { EstablishmentValidator } from "../validators/establishment.validator.js";
import {
  ESTABLISHMENT_UPLOAD_DIR,
  existsImage,
  removeImage,
} from "../config/upload.images.js";

export const EstablishmentService = {
  async list(filters) {
    await EstablishmentValidator.validateListEstablishments(filters);
    const establishments = await EstablishmentRepository.list(filters);
    return establishments;
  },
  async find(id) {
    const establishment = await EstablishmentRepository.getById(id);
    if (!establishment) {
      throw new Error("Establishment not found");
    }
    const establishment_json = establishment.toJSON();
    if (establishment_json.image_path) {
      establishment_json.image_exists = await existsImage(
        ESTABLISHMENT_UPLOAD_DIR,
        establishment_json.image_path,
      );
    } else {
      establishment_json.image_exists = false;
    }
    delete establishment_json.image_path;
    return establishment_json;
  },
  async create(establishmentData) {
    await EstablishmentValidator.validateCreate(establishmentData);
    const newEstablishment =
      await EstablishmentRepository.create(establishmentData);
    return newEstablishment;
  },
  async update(id, establishmentData) {
    await EstablishmentValidator.validateUpdate(establishmentData);
    const existingEstablishment = await EstablishmentRepository.getById(id);
    if (!existingEstablishment) {
      throw new Error("Establishment not found");
    }
    await existingEstablishment.update(establishmentData);
    return existingEstablishment;
  },
  async delete(id) {
    const existingEstablishment = await EstablishmentRepository.getById(id);
    if (!existingEstablishment) {
      throw new Error("Establishment not found");
    }
    await EstablishmentRepository.delete(id);
    if (existingEstablishment.image_path) {
      await removeImage(
        ESTABLISHMENT_UPLOAD_DIR,
        existingEstablishment.image_path,
      );
    }
    return existingEstablishment;
  },
};
