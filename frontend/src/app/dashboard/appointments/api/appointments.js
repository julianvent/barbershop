import { appointments } from "@/app/utils/data";

export async function getAppointments({ userId }) {
  await new Promise((res) => setTimeout(res, 700));
  const fetchAppointments = appointments;
  return fetchAppointments;
}

export async function getAppointment({ appointmentId }) {
  await new Promise((res) => setTimeout(res, 700));
  const fetchAppointment = appointments.find((appointment) => {
    return appointment.id == appointmentId;
  });
  return fetchAppointment;
}

export function createAppointment(data) {
  console.log(data);
}

export function updateAppointment(data) {
  console.log(data);
}
