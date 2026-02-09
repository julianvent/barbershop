import axios from "axios";
import { axiosConfig } from "../utils/requestBuilder";

const baseUrl = '/api/schedules/'

export async function getSchedules(id) {
  try {
    const headers = await axiosConfig();
    const response = await axios.get(baseUrl + `?establishment_id=${id}` ,headers);
    return response.data;

  } catch (err) {
    console.log(err)
    throw "Error obteniendo los horarios del establecimiento";
  }
} 

export async function createSchedules(id, data) {
  throw "Error al crear el horario del establecimiento";
}

export async function updateSchedules(id, data) {
  console.log(data)
  throw "Error al modificar los horarios del establecimiento";
}