import { Op } from "sequelize";

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

  async validateUniqueAttributes(Model, attrs) {
    const orConditions = Object.entries(attrs).map(([key, value]) => ({
      [key]: value,
    }));

    const existing = await Model.findOne({
      where: { [Op.or]: orConditions },
    });
    if (existing) {
      throw new Error(`The object with provided attributes already exists:\n
        : ${JSON.stringify(attrs)}`);
    }
  },
};
