import { BarberRepository } from "../repositories/barber.repository.js";
import { BarberValidator } from "../validators/barber.validator.js";
import {
  existsImage,
  removeImage,
  normalizeImagePath,
  BARBER_UPLOAD_DIR,
} from "../config/upload.images.js";
const monkeyBarber = "assets/images/monkeyBarber.png";

export const BarberService = {
  async list(filters) {
    const { limit, page, sort } =
      await BarberValidator.validateFiltersListbarbers(filters);
    const offset = (page - 1) * limit;
    const { rows: barbers, count } = await BarberRepository.list(
      offset,
      limit,
      sort,
    );

    return {
      data: barbers,
      meta: {
        page: page,
        limit: limit,
        total: count,
        pages: page,
      },
    };
  },
  async find(id) {
    const existing_barber = await BarberRepository.getById(id);

    if (!existing_barber) {
      throw new Error("Barber not found");
    }
    return existing_barber;
  },
  async create(barberData) {
    if (!barberData.image_path) {
      barberData.image_path = monkeyBarber;
    } else {
      barberData.image_path = normalizeImagePath(
        barberData.image_path,
        BARBER_UPLOAD_DIR,
      );
    }
    BarberValidator.validateCreate(barberData);
    return BarberRepository.create(barberData);
  },
  async update(id, barberData) {
    BarberValidator.validateUpdate(barberData);
    const existing_barber = await BarberRepository.getById(id);
    if (!existing_barber) {
      throw new Error("Barber not found");
    }
    if (
      barberData.image_path &&
      existsImage(existing_barber.image_path) &&
      existing_barber.image_path != "default.png"
    ) {
      removeImage(existing_barber.image_path);
    }
    if (barberData.image_path) {
      barberData.image_path = normalizeImagePath(
        barberData.image_path,
        BARBER_UPLOAD_DIR,
      );
    }

    return BarberRepository.update(id, barberData);
  },
  async delete(id) {
    const existing_barber = await BarberRepository.getById(id);
    if (!existing_barber) {
      throw new Error("Barber not found");
    }
    if (
      existsImage(existing_barber.image_path, BARBER_UPLOAD_DIR) &&
      existing_barber.image_path != "default.png"
    ) {
      removeImage(existing_barber.image_path, BARBER_UPLOAD_DIR);
    }
    return BarberRepository.delete(id);
  },
};
