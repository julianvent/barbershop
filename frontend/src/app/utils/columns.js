export const defaultColDef={
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
    field: "customer",
    width: 200,
  },
  {
    headerName: "Teléfono",
    field: "phone",
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
  },
  {
    headerName: "Duracion Aproximada",
    field: "duration",
  },
  {
    headerName: "Tipo",
    field: "type",
  }
];


export const employeesEntries = [
  {
    headerName: "Nombre",
    field: "name",
  },
  {
    headerName: "Apellidos",
    field: "last_names",
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