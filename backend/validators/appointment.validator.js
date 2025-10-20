// Make a global state for validating appointment data
const states = ["pendiente", "confirmada", "completada", "cancelada"];

const WhiteListQueryParams = [
  "nombre_cliente",
  "numero_telefonico_cliente",
  "fecha_hora_cita",
  "duracion_total",
  "estado",
];

export const AppointmentValidator = {
  validateCreate(data) {
    const requiredFields = WhiteListQueryParams;
    for (const field of requiredFields) {
      if (!(field in data)) {
        throw new Error(`Missing required field: ${field}`);
      }
    }

    if (!states.includes(data.estado)) {
      throw new Error(
        `Invalid estado value. Must be one of: ${states.join(", ")}`
      );
    }

    if (!Number.isInteger(data.duracion_total) || data.duracion_total <= 0) {
      throw new Error(
        "duracion_total must be a positive integer representing minutes"
      );
    }
  },
};
