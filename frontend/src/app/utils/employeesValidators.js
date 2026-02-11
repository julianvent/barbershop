export const nameValidation = {
  id: "barber_name",
  type: "text",
  name: "name",
  label: "Nombre Completo",
  validation: {
    required: "Ingrese el nombre del empleado",
  },
};

export const lastNameValidation = {
    id: 'last_names',
    type: 'text',
    name: "last_names",
    label: "Apellidos",
    validation: {
        required: "Ingrese los apellidos del empleado"
    }
}

export const phoneValidation = {
    id: 'phone',
    type: 'text',
    name: "phone",
    label: "Telefono",
    validation: {
        required: "Ingrese el telefono del empleado",
        minLength :{ 
            value: 10,
            message: 'Ingrese un numero de celular valido'
        }
    }   
}

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

export const photoValidation = (hasPhoto) => ({
  id: "image",
  type: "file",
  label: "Añada la Foto del Empleado",
  validation: {
    validate: (files) => {
              const file = files[0];
              if (hasPhoto) return true;
              if (!file) return "Archivo obligatorio";
              const allowedTypes = ["image/jpeg", "image/png"];
              return allowedTypes.includes(file.type) || "Solo se permiten JPG o PNG";
    }
  },
});

export const statusValidation = {
  id: "is_active",
  label: "Estado",
  validation: {
    required: "Seleccione el estado",
  },
};

export const establishmentValidation = {
  id: "establishment_id",
  label: "Seleccione el establecimiento al que se asignara la cuenta:",
  validation: {
    required: "Requerido*"
  }
}

