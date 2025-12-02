import { appointments } from "@/app/utils/data";
import { axiosConfig } from "@/app/utils/requestBuilder";
import axios from "axios";
import { getAllAppointmentsApiRoute } from "../../services/api/routes";

export async function getAppointments() {
  try {
    const headers = await axiosConfig();
    const res = await axios.get(getAllAppointmentsApiRoute, headers);
    const appointments = res.data.data;

    // split the appointment_datetime ISO string into separate date and time fields
    const pad = (n) => String(n).padStart(2, "0");
    const splitDateTime = (isoString) => {
      if (!isoString) return { date: null, time: null };
      const d = new Date(isoString);
      const date = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(
        d.getDate()
      )}`;
      const time = `${pad(d.getHours())}:${pad(d.getMinutes())}`;
      return { date, time };
    };

    const mapped = appointments.map((appointment) => {
      const { date, time } = splitDateTime(appointment.appointment_datetime);
      return {
        ...appointment,
        date,
        time,
      };
    });

    return mapped;
  } catch (error) {
    throw error;
  }
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
