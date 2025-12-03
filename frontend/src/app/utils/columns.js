export const defaultColDef = {
  resizable: true,
  sortable: true,
  flex: 2,
  minWidth: 100,
};

export const appointmentColumns = [
  {
    headerName: "Fecha",
    field: "date",
    width: 120,
  },
  {
    headerName: "Hora",
    field: "time",
    width: 100,
  },
  {
    headerName: "Cliente",
    field: "customer_name",
    width: 200,
  },
  {
    headerName: "Teléfono",
    field: "customer_phone",
    width: 150,
  },
];

export const serviceFields = [
  {
    headerName: "Nombre",
    field: "name",
  },
  {
    headerName: "Precio",
    field: "price",
    valueFormatter: (params) => params.data.price.toFixed(2),
  },
  {
    headerName: "Duracion Aproximada",
    field: "duration",
    valueFormatter: (params) =>
      Math.floor(params.data.duration / 60) >= 1
        ? Math.floor(params.data.duration / 60) +
          " hr " +
          (params.data.duration % 60) +
          " minutos"
        : params.data.duration + " minutos",
  },
  {
    headerName: "Tipo",
    field: "type",
  },
];

export const employeesEntries = [
  {
    headerName: "Nombre Completo",
    field: "barber_name",
  },
  {
    headerName: "Telefono",
    field: "phone",
  },
  {
    headerName: "Correo",
    field: "email",
  },
];
