
export const durationValidation = {
  id:"duration",
  type: "number",
  name: "duration",
  label: "Duracion (minutos)",
  validation: {
    required: "Ingrese la duración ",
    min: {
      value: 10,
      message: "El servicio debe durar mas de 10 minutos"
    },
  }
}

export const typeValidation = {
  id: "type",
  type: "text",
  name: "type",
  label: "Tipo del Servicio",
  validation: {
    required: "Ingrese el tipo del servicio",
  },
};


export const nameValidation = {
  id: "name",
  type: "text",
  name: "name",
  label: "Nombre",
  validation: {
    required: "Ingrese el nombre del servicio",
  },
};

export const priceValidation = {
  id: "price",
  type: "number",
  name: "price",
  label: "Precio",
  validation: {
    required: "Ingrese el precio",
    min: {
      value: 1,
      message: "El precio debe ser un valor valido"
    }
  }
}

export const descriptionValidation = {
  id: "description",
  type: "text",
  name: "description",
  label: "Descripcion",
  validation: {
    required: "Ingrese una breve descripcion"
  }
}

export const statusValidation = {
  id: "status",
  label: "Estado",
  validation: {
    required: "Seleccione el estado",
  },
};
