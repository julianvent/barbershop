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

export const defaultSchedules = [
  {day_of_week: 'Monday', start_time: '09:00:00', end_time: '18:00:00', is_active: true, },
  {day_of_week: 'Tuesday', start_time: '09:00:00', end_time: '18:00:00', is_active: true, },
  {day_of_week: 'Wednesday', start_time: '09:00:00', end_time: '18:00:00', is_active: true, },
  {day_of_week: 'Thursday', start_time: '09:00:00', end_time: '18:00:00', is_active: true, },
  {day_of_week: 'Friday', start_time: '09:00:00', end_time: '18:00:00', is_active: true, },
  {day_of_week: 'Saturday', start_time: '10:00:00', end_time: '16:00:00', is_active: true, },
  {day_of_week: 'Sunday', start_time: '00:00:00', end_time: '00:00:00', is_active: false, },
]