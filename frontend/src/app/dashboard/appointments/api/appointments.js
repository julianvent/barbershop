import { axiosConfig } from "@/app/utils/requestBuilder";
import axios from "axios";
import {
  completeAppointmentApiRoute,
  createAppointmentApiRoute,
  getAppointmentsApiRoute,
  getAvailabilityApiRoute,
  updateAppointmentApiRoute,
} from "./routes";

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

export async function getAppointment(appointmentId, auth) {
  const params = new URLSearchParams();

  if (auth) {
    params.append("auth", auth);
  }
  try {
    const headers = await axiosConfig();

    const config = {
      ...headers,
      params: params,
    };

    const res = await axios.get(
      getAppointmentsApiRoute + appointmentId,
      config
    );
    const appointment = res.data;

    const { date, time } = splitDateTime(appointment.appointment_datetime);
    return { ...appointment, date, time };
  } catch (error) {
    throw error;
  }
}

export async function createAppointment(data) {
  try {
    // NOTE: This operation doesn't require auth
    // -- parse data --
    const parsedData = { ...data };
    parsedData.appointment_datetime = convertDateToISOString(data);
    const res = await axios.post(createAppointmentApiRoute, parsedData);

    return res;
  } catch (error) {
    throw error;
  }
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

export async function completeAppointment(data, id){
  try{
    const headers = await axiosConfig();
    delete headers.headers['Content-Type'];
    const url = completeAppointmentApiRoute.replace('${id}', id);
    
    const formData = new FormData();
    formData.append("image", data.image[0]);

    axios.post(url, formData, headers);
    
  }catch(err){
    throw 'La cita no se pudo completar correctamente';
  }

}

export async function getAvailabity(barberId, date) {
  const params = new URLSearchParams();
  params.append("barber_id", barberId);

  if (date) {
    params.append("from", date);
  }

  try {
    const res = await axios.get(getAvailabilityApiRoute, { params });
    return res.data;
  } catch (error) {
    throw error;
  }
}

const splitDateTime = (isoString) => {
  if (!isoString) return { date: null, time: null };

  const pad = (n) => String(n).padStart(2, "0");
  const d = new Date(isoString);

  // Use UTC getters to avoid timezone conversion
  // Funny because the database stores it as UTC when it is actually CTS
  const date = `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(
    d.getUTCDate()
  )}`;
  const time = `${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}`;
  return { date, time };
};

function convertDateToISOString(data) {
  const date = data.date;
  const time = data.time;

  const datetime = new Date(`${date}T${time}:00`);
  return datetime.toISOString();
}
