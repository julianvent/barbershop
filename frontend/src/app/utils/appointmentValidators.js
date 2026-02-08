export const customerNameValidation = {
  id: "customer_name",
  type: "text",
  label: "Nombre",
  validation: {
    required: "Requerido*",
  },
};

export const phoneValidation = {
  id: "customer_phone",
  type: "text",
  label: "Teléfono (opcional)",
  validation: {
    pattern: {
      value: /^\d{10}$/,
      message: "Formato: 9211231234",
    },
  },
};

export const dateValidation = {
  id: "date",
  type: "date",
  label: "Fecha de la cita",
  validation: {
    required: "Requerido*",
  },
};

export const timeValidation = {
  id: "time",
  label: "Horarios disponibles",
  validation: {
    required: "Selecciona un horario*",
  },
};

export const statusValidation = {
  id: "status",
  label: "Estado de la cita",
  validation: {
    required: "Requerido*",
  },
};

export const barberValidation = {
  id: "barber_id",
  validation: {
    required: "Selecciona un barbero*",
  },
};

export const establishmentValidation = {
  id: "establishment_id",
  validation: {
    required: "Selecciona un establecimiento*"
  }
}

export const serviceValidation = {
  id: "services_ids",
  validation: {
    validate: (value) =>
      value.length > 0 ? true : "Selecciona uno o más servicios*",
  },
};

export const customerEmailValidation = {
  id: "customer_email",
  type: "email",
  label: "Correo electrónico (opcional)",
  validation: {
    pattern: {
      value: /\S+@\S+\.\S+/,
      message: "Formato: correo@dominio.com",
    },
  },
};

export const appoinmentPhotoValidation = {
  id: "image",
  type: "file",
  label: "Adjunte la imagen final de la cita",
  validation: {
    required: 'Se debe adjuntar una imagen',
    validate: {
      acceptedFormats: (fileList) => {
        const file = fileList?.[0];
        const allowed = ["image/jpeg", "image/png", "image/jpg"];
        return file && allowed.includes(file.type)
          ? true
          : "Solo se aceptan imágenes JPG o PNG";
      },
      maxSize: (fileList) => {
        const file = fileList?.[0];
        return file && file.size <= 3 * 1024 * 1024
          ? true
          : "La imagen debe pesar máximo 3MB";
      },
  },
  }
};

export const appointmentAuthQueryParam = "auth";
