import { EstablishmentRepository } from "../repositories/establishment.repository.js";
import { EstablishmentValidator } from "../validators/establishment.validator.js";
import path from "path";
import {
  ESTABLISHMENT_UPLOAD_DIR,
  existsImage,
  removeImage,
} from "../config/upload.images.js";

export const EstablishmentService = {
  async list(filters) {
    EstablishmentValidator.validateListEstablishments(filters);
    const establishments = await EstablishmentRepository.list(filters);
    return establishments;
  },
  async find(id) {
    const establishment = await EstablishmentRepository.getById(id);
    if (!establishment) {
      throw new Error("Establishment not found");
    }
    const establishment_json = establishment.toJSON();
    return establishment_json;
  },
  async create(establishmentData) {
    if (establishmentData.image_path) {
      establishmentData.image_path = `/${path.relative(
        process.cwd(),
        path.join(ESTABLISHMENT_UPLOAD_DIR, establishmentData.image_path),
      )}`;
    }
    EstablishmentValidator.validateCreate(establishmentData);
    return EstablishmentRepository.create(establishmentData);
  },
  async update(id, establishmentData) {
    EstablishmentValidator.validateUpdate(establishmentData);
    const existingEstablishment = await EstablishmentRepository.getById(id);
    if (!existingEstablishment) {
      throw new Error("Establishment not found");
    }
    if (
      establishmentData.image_path &&
      existsImage(existingEstablishment.image_path, ESTABLISHMENT_UPLOAD_DIR)
    ) {
      removeImage(existingEstablishment.image_path, ESTABLISHMENT_UPLOAD_DIR);
    }
    if (establishmentData.image_path !== undefined) {
      establishmentData.image_path = `/${path.relative(process.cwd(),
        path.join(ESTABLISHMENT_UPLOAD_DIR, establishmentData.image_path))}`;
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
      removeImage(
        existingEstablishment.image_path,
        ESTABLISHMENT_UPLOAD_DIR,
      );
    }
    return existingEstablishment;
  },
};
