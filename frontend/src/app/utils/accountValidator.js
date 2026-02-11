export const fullNameValidation = {
  id: "full_name",
  type: "text",
  label: "Nombre de Usuario",
  validation: {
    required: "Requerido*",
  },
};

export const emailValidation = {
  id: "email",
  type: "email",
  name: "email",
  label: "Correo electrónico",
  validation: {
    required: "Ingrese el correo del empleado",
    pattern: {
      value: /\S+@\S+\.\S+/,
      message: "Formato de correo inválido",
    },
  },
};

export const passwordValidation = {
  id: "password",
  type: "password",
  label: "Ingrese la nueva contraseña",
  validation: {
  },
};