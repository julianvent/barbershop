export const customerNameValidation = {
  id: "customer_name",
  type: "text",
  label: "Nombre",
  validation: {
    required: "Requerido",
  },
};

export const phoneValidation = {
  id: "customer_phone",
  type: "text",
  label: "Teléfono",
  validation: {
    required: "Requerido",
    pattern: {
      value: /^\d{10}$/,
      message: "Teléfono incorrecto",
    },
  },
};

export const dateValidation = {
  id: "date",
  type: "date",
  label: "Fecha programada",
  validation: {
    required: "Requerido",
  },
};

export const timeValidation = {
  id: "time",
  validation: {
    required: "Selecciona un horario",
  },
};

export const statusValidation = {
  id: "status",
  label: "Estado de la cita",
  validation: {
    required: "Requerido",
  },
};

export const barberValidation = {
  id: "barber_id",
  validation: {
    required: "Selecciona un barbero",
  },
};

export const serviceValidation = {
  id: "services_ids",
  validation: {
    required: "Selecciona uno o más servicios",
  },
};

export const customerEmailValidation = {
  id: "customer_email",
  type: "email",
  label: "Correo electrónico",
  validation: {
    required: "Requerido",
    pattern: {
      value: /\S+@\S+\.\S+/,
      message: "Formato de correo inválido",
    },
  },
};
