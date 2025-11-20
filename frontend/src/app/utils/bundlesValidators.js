export const nameValidation = {
  id: "name",
  type: "text",
  name: "name",
  label: "Nombre del paquete",
  validation: {
    required: "Ingrese el nombre del paquete",
  },
};

export const priceValidation = {
  id: "price",
  type: "number",
  name: "price",
  label: "Precio",
  validation: {
    required: "Ingrese el precio"
  }
};

export const descriptionValidation = {
  id: "description",
  type: "text",
  name: "description",
  label: "Descripcion",
  validation: {
    required: "Ingrese una breve descripcion"
  }
};