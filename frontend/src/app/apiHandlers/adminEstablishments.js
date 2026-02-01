import { axiosConfig } from "@/app/utils/requestBuilder";
import axios from 'axios';

import { baseUrl } from "@/app/routes/adminEstablishment";

export const getEstablishments = async () => {
  try {
    const headers = await axiosConfig();
    const response = await axios.get(baseUrl, headers);
    return response.data;
  } catch (e) {
    throw 'Error obteniendo los establecimientos'
  }
};


export const getEstablishment = async ({ id }) => {
  try{
    const headers = await axiosConfig();
    const request = await axios.get(baseUrl+id, headers);
    return request.data;
  }catch (e) {
    console.log(e)
    throw 'Error obteniendo el establecimiento'
  }
};

export const createNewEstablishment = async ({ data }) => {
  try {
    const headers = await axiosConfig();
    delete headers.headers["Content-Type"];


    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("city", data.city);
    formData.append("state", data.state);
    formData.append("street", data.street);
    formData.append("ext_number", data.ext_number);
    formData.append("int_number", data.int_number);
    formData.append("postal_code", data.postal_code);
    formData.append("phone_number", data.phone_number);

    if (data.image && data.image.length > 0) {
      formData.append("image", data.image[0]);
    }
    await axios.post(baseUrl, formData, headers)
    return null;
  } catch (e) {
    console.log(e);
    throw 'Error creando el establecimiento revise la informacion ingresada';
  }
};

export const updateEstablishment = async ({ id, data}) => {
  try {
    const headers = await axiosConfig();
    delete headers.headers["Content-Type"];


    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("city", data.city);
    formData.append("state", data.state);
    formData.append("street", data.street);
    formData.append("ext_number", data.ext_number);
    formData.append("int_number", data.int_number);
    formData.append("postal_code", data.postal_code);
    formData.append("phone_number", data.phone_number);

    if (data.image && data.image.length > 0) {
      formData.append("image", data.image[0]);
    }
    await axios.put(baseUrl+id, formData, headers)
    return null;
  } catch (e) {
    console.log(e);
    throw 'Error actualizando el establecimiento revise la informacion ingresada';
  }
};

export const deleteEstablishment = async ( id ) => {
    try{
    const headers = await axiosConfig();
    const request = await axios.delete(baseUrl+id, headers);
    return request.data;
  }catch (e) {
    console.log(e)
    throw 'Error eliminando el establecimiento'
  }
};