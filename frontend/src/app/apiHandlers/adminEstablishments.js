import { axiosConfig } from "@/app/utils/requestBuilder";
import axios from 'axios';

import { baseUrl } from "@/app/routes/adminEstablishment";

export const getEstablishments = async () => {
  try {
    const response = await axios.get(baseUrl, axiosConfig);
    return response.data;
  } catch (e) {
    throw 'Error obteniendo los establecimientos'
  }
};


export const getEstablishment = async ({ id }) => {

};

export const createNewEstablishment = async ({ data }) => {
  try {
    delete data.image
    await axios.post(baseUrl, data, axiosConfig)
    return null;
  } catch (e) {
    console.log(e);
    throw 'Error creando el establecimiento revise la informacion ingresada';
  }
};

export const updateEstablishment = async ({ id, data}) => {

};

export const deleteEstablishment = async ({ id }) => {

};