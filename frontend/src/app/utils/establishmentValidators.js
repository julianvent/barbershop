export const nameValidation = {
  id: "name",
  type: "text",
  label: "Nombre del establecimiento",
  validation: {
    required: "Requerido*"
  }
}

export const phoneValidation = {
  id: 'phone',
  type: 'text',
  name: "phone",
  label: "Telefono del establecimiento",
  validation: {
      required: "Ingrese el telefono del establecimiento",
      minLength :{ 
          value: 10,
          message: 'Ingrese un numero de celular valido'
      }
  }   
}

export const cityValidation = {
  id: 'city',
  type: 'text',
  name: 'city',
  label: 'Ciudad',
  validation: {
    required: 'Requerido*'
  }
}

export const colonyValidation = {
  id: 'colony',
  type: 'text',
  name: 'colony',
  label: 'Colonia',
  validation: {
    required: 'Requerido*'
  }
}

export const streetValidation = {
  id: 'street',
  type: 'text',
  name: 'street',
  label: 'Calle',
  validation: {
    required: 'Requerido*'
  }
}

export const externalNoValidation = {
  id: 'ext_no',
  type: 'text',
  name: 'ext_no',
  label: 'Numero Externo',
  validation: {
    required: 'Requerido*'
  }
}

export const internalNoValidation = {
  id: 'int_no',
  type: 'text',
  name: 'int_no',
  label: 'Numero Interno',
}

export const postalCodeValidation = {
  id: 'postal_code',
  type: 'number',
  name: 'postal_code',
  label: 'Codigo Postal',
  validation: {
    required: 'Requerido*',
    length: {
      value: 5,
      message: 'El codigo postal debe ser de 5 caracteres'
    }
  }
  
}

export const photoValidation = (hasPhoto) => ({
  id: "image",
  type: "file",
  label: "Añada la Foto del Establecimiento",
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
