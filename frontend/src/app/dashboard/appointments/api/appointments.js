import { axiosConfig } from "@/app/utils/requestBuilder";
import axios from "axios";
import { getAppointmentsApiRoute, updateAppointmentApiRoute } from "./routes";

export async function getAppointments() {
  try {
    const headers = await axiosConfig();
    const res = await axios.get(getAppointmentsApiRoute, headers);
    const appointments = res.data.data;

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

export async function getAppointment(appointmentId) {
  try {
    const headers = await axiosConfig();
    const res = await axios.get(
      getAppointmentsApiRoute + appointmentId,
      headers
    );
    const appointment = res.data;

    const { date, time } = splitDateTime(appointment.appointment_datetime);
    return { ...appointment, date, time };
  } catch (error) {
    throw error;
  }
}

export function createAppointment(data) {
  console.log(data);
}

export async function updateAppointment(data) {
  try {
    const appointmentId = data.id;
    const headers = await axiosConfig();

    // --- parse data ---
    const parsedData = { ...data };
    parsedData.appointment_datetime = convertDateToISOString(data);

    const res = await axios.put(
      updateAppointmentApiRoute + appointmentId,
      parsedData,
      headers
    );

    return res;
  } catch (error) {
    throw error;
  }
}

const splitDateTime = (isoString) => {
  // split the appointment_datetime ISO string into separate date and time fields
  const pad = (n) => String(n).padStart(2, "0");

  if (!isoString) return { date: null, time: null };
  const d = new Date(isoString);
  const date = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(
    d.getDate()
  )}`;
  const time = `${pad(d.getHours())}:${pad(d.getMinutes())}`;
  return { date, time };
};

function convertDateToISOString(data) {
  const date = data.date;
  const time = data.time;
  const datetime = new Date(`${date}T${time}:00`);

  return datetime.toISOString();
}
