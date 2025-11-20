
export const durationValidation = {
  id:"duracion",
  type: "number",
  name: "duration",
  label: "Duracion",
  validation: {
    required: "Ingrese la duración ",
    min: {
      value: 10,
      message: "El servicio debe durar mas de 10 minutos"
    },
  }
}

export const typeValidation = {
  id: "tipo",
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
  label: "Nombre del servicio",
  validation: {
    required: "Ingrese el nombre del servicio",
  },
};

export const priceValidation = {
  id: "precio",
  type: "number",
  name: "price",
  label: "Precio",
  validation: {
    required: "Ingrese el precio"
  }
}

export const descriptionValidation = {
  id: "descripcion",
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
