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
      throw new Error(`Invalid sort value. Must be one of: ${validSortValues.join(", ")}`);
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
