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
    const {
      establishment_id,
      name,
      street,
      city,
      postal_code,
      sort,
      page,
      limit,
    } = filters;
    if (establishment_id != null && !Number.isInteger(Number(establishment_id))) {
      throw new Error("establishment_id must be an integer");
    }
    if (sort != null && !["name_asc", "name_desc"].includes(sort)) {
      throw new Error("Invalid sort value. Must be 'name_asc' or 'name_desc'");
    }
    if (page != null && (!Number.isInteger(Number(page)) || Number(page) <= 0)) {
      throw new Error("page must be a positive integer");
    }
    if (limit != null && (!Number.isInteger(Number(limit)) || Number(limit) <= 0)) {
      throw new Error("limit must be a positive integer");
    }
    return {
      establishment_id: establishment_id != null ? Number(establishment_id) : null,
      name: name != null ? String(name) : null,
      street: street != null ? String(street) : null,
      city: city != null ? String(city) : null,
      postal_code: postal_code != null ? String(postal_code) : null,
      sort: sort != null ? String(sort) : null,
      page: page != null ? Number(page) : 1,
      limit: limit != null ? Number(limit) : 10,
    };
  },
  validateCreate(establishmentData) {
    if (!establishmentData || typeof establishmentData !== "object") {
      throw new Error("Body is empty or invalid");
    }
    for (const field of VALID_REQUIRED_FIELDS) {
      if (!(field in establishmentData)) {
        throw new Error(`Missing required field: ${field}`);
      }
    }
  },
  validateUpdate(establishmentData) {
    if (!establishmentData || typeof establishmentData !== "object") {
      throw new Error("Body is empty or invalid");
    }
    for (const key of Object.keys(establishmentData)) {
      if (!VALID_UPDATE_FIELDS.includes(key)) {
        throw new Error(`Invalid field for update: ${key}`);
      }
    }
  },
};
