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
  try {
    const headers = await axiosConfig();
    const uri = baseUrl + 'bulk';
    const newData = {
      establishment_id : id,
      schedules : data.schedules
    }
    await axios.post(uri, newData, headers)
  } catch (error) {
    console.log(error)
    throw "Error al crear el horario del establecimiento";
  }
}

export async function updateSchedules(id, data) {
    try {
    const headers = await axiosConfig();
    const uri = baseUrl + 'bulk';
    const newData = {
      establishment_id : id,
      schedules : data.schedules
    }
    await axios.put(uri, newData, headers);
  } catch (error) {
    console.log(error)
    throw "Error al modificar los horarios del establecimiento";
  }
}