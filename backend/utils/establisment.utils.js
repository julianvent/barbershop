import { Op } from "sequelize";
import { BASE_URL_BACKEND } from "../services/jwt.service.js";

// The following attributes must be unique also they're required
const REQUIRED_ATTRS = [
  "name",
  "street",
  "city",
  "state",
  "postal_code",
  "phone_number",
];

export const EstablishmentUtils = {
  async cannotBeEmpty(params) {
    for (const param of params) {
      if (param == null || String(param).trim() === "") {
        throw new Error("Required establishment attributes cannot be empty");
      }
    }
  },
  async validateUniqueAttributes(Model, attrs, excludeId = null) {
    // Check 1: Unique index constraint (name + postal_code + street)
    const uniqueIndexWhere = {
      name: attrs.name,
      postal_code: attrs.postal_code,
      street: attrs.street,
    };

    if (excludeId) {
      uniqueIndexWhere.id = { [Op.ne]: excludeId };
    }

    const existingIndex = await Model.findOne({ where: uniqueIndexWhere });
    if (existingIndex) {
      throw new Error(
        `An establishment with the same name, postal code, and street already exists`,
      );
    }

    // Check 2: Same physical address (different name allowed by index, but not by business logic)
    const addressWhere = {
      street: attrs.street,
      city: attrs.city,
      state: attrs.state,
      postal_code: attrs.postal_code,
      int_number: attrs.int_number || null,
      ext_number: attrs.ext_number || null,
    };

    if (excludeId) {
      addressWhere.id = { [Op.ne]: excludeId };
    }

    const existingAddress = await Model.findOne({ where: addressWhere });
    if (existingAddress) {
      throw new Error(
        `An establishment already exists at this address (${attrs.street}, ${attrs.city}, ${attrs.state})`,
      );
    }
  },
  async generateImageUrl(relativePath) {
    if (relativePath == null) return null;
    return `${BASE_URL_BACKEND}${relativePath}`.replace(/\\/g, "/");
  },
};
