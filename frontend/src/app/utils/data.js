export const account = { name: "Monkeybarber" };

export const status = [
  { id: 1, name: "Pendiente por confirmar", value: "pending" },
  { id: 2, name: "Confirmada", value: "confirmed" },
  { id: 4, name: "Cancelada", value: "cancelled" },
];

export const appointments_fields = [
  {
    headerName: "Nombre",
    field: "customer_name",
  },
  {
    headerName: "Barbero asignado",
    field: "barber_name",
  },
  {
    headerName: "Estado",
    field: "status",
  },
  {
    headerName: "Horario programado",
    field: "date",
  },
];

export const appointments_actions = [
  {
    text: "Editar",
    base_url: "/appointments/",
  },
];

export const defaultColDef = {
  resizable: true,
  sortable: true,
  flex: 2,
  minWidth: 100,
};

export const serviceFields = [
  {
    headerName: "Nombre",
    field: "name",
  },
  {
    headerName: "Precio",
    field: "precio",
  },
  {
    headerName: "Duracion Aproximada",
    field: "duracion",
  },
  {
    headerName: "Tipo",
    field: "tipo",
  },
];
