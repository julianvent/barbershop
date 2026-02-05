export const account = { name: "Monkeybarber" };

export const status = [
  { id: 1, name: "Pendiente por confirmar", value: "pending" },
  { id: 2, name: "Confirmada", value: "confirmed" },
  { id: 4, name: "Cancelada", value: "cancelled" },
];

export const roles = [
  {id: 1, name: "Administrador", value: "admin"},
  {id: 2, name: "Recepcionista", value: "receptionist"},
  {id: 3, name: "Barbero", value: "barber"}
]

export const appointments_actions = [
  {
    text: "Editar",
    base_url: "/appointments/",
  },
];