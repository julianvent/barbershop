export const emailValidation = {
  id: "email",
  type: "email",
  name: "email",
  label: "Correo electrónico",
  autoComplete: "email",
  validation: {
    required: "Requerido",
    pattern: {
      value: /\S+@\S+\.\S+/,
      message: "Formato de correo inválido",
    },
  },
};

export const passwordValidation = {
  id: "password",
  type: "password",
  name: "password",
  autoComplete: "current-password",
  label: "Contraseña",
  validation: {
    required: "Requerido",
  },
};

export const nameValidation = {
  id: "full_name",
  type: "text",
  name: "full_name",
  label: "Nombre completo",
  validation: {
    required: "Requerido",
  },
};
