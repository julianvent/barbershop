import { Op } from "sequelize";
import { Establishment } from "../models/establishment.model.js";

const VALID_REQUIRED_FIELDS = [
  "name",
  "street",
  "city",
  "state",
  "postal_code",
  "phone_number",
];
const VALID_UPDATE_FIELDS = [
  ...VALID_REQUIRED_FIELDS,
  "int_number",
  "ext_number",
  "image_path",
];

export const EstablishmentValidator = {
  validateListEstablishments(filters) {
    const { sort, page, limit } = filters;
    const validSortValues = ["ASC", "DESC"];

    if (sort && !validSortValues.includes(sort.toUpperCase())) {
      throw new Error(
        `Invalid sort value. Must be one of: ${validSortValues.join(", ")}`,
      );
    }

    if (page !== undefined) {
      const pageNum = parseInt(page);
      if (isNaN(pageNum) || pageNum < 1) {
        throw new Error("Page must be a positive integer");
      }
    }

    if (limit !== undefined) {
      const limitNum = parseInt(limit);
      if (isNaN(limitNum) || limitNum < 1) {
        throw new Error("Limit must be a positive integer");
      }
    }
  },
  async validateCreate(establishmentData) {
    if (!establishmentData || typeof establishmentData !== "object") {
      throw new Error("Body is empty or invalid");
    }
    for (const field of VALID_REQUIRED_FIELDS) {
      if (!(field in establishmentData)) {
        throw new Error(`Missing required field: ${field}`);
      }
    }
    await isEstablishmentCreated(Establishment, establishmentData);
  },
  async validateUpdate(establishmentData) {
    if (!establishmentData || typeof establishmentData !== "object") {
      throw new Error("Body is empty or invalid");
    }
    for (const key of Object.keys(establishmentData)) {
      if (!VALID_UPDATE_FIELDS.includes(key)) {
        throw new Error(`Invalid field for update: ${key}`);
      }
    }
    await isEstablishmentCreated(
      Establishment,
      establishmentData,
      establishmentData.id,
    );
  },
};

async function isEstablishmentCreated(Model, attrs, excludeId = null) {
  const addExclusion = (whereClause) => {
    if (excludeId) {
      whereClause.id = { [Op.ne]: excludeId };
    }
    return whereClause;
  };

  // Check 1: Unique index constraint
  const uniqueIndexWhere = addExclusion({
    name: attrs.name,
    postal_code: attrs.postal_code,
    street: attrs.street,
  });

  const existingIndex = await Model.findOne({ where: uniqueIndexWhere });
  if (existingIndex) {
    throw new Error(
      `An establishment with the same name, postal code, and street already exists`,
    );
  }

  // Check 2: Same physical address
  const addressWhere = addExclusion({
    street: attrs.street,
    city: attrs.city,
    state: attrs.state,
    postal_code: attrs.postal_code,
    int_number: attrs.int_number || null,
    ext_number: attrs.ext_number || null,
  });

  const existingAddress = await Model.findOne({ where: addressWhere });
  if (existingAddress) {
    throw new Error(
      `An establishment already exists at this address (${attrs.street}, ${attrs.city}, ${attrs.state})`,
    );
  }
}
