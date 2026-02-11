export const fullNameValidation = {
  id: "full_name",
  type: "text",
  label: "Nombre del Usuario",
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

export const roleValidation = {
  id: "role",
  label: "Rol de la cuenta:",
  validation: {
    required: "Requerido*",
  },
};

export const passwordValidation = (isNeeded) => ({
  id: "password",
  type: "password",
  label: isNeeded ? "Ingrese contraseña de la cuenta": 'Actualize la contraseña de ser necesario',
  validation: {
    required: isNeeded
  },
});

export const establishmentValidation = {
  id: "establishment_id",
  label: "Seleccione el establecimiento al que se asignara la cuenta:",
  validation: {
    required: "Requerido*"
  }
}
