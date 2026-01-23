import { axiosConfig } from "@/app/utils/requestBuilder";
import axios from 'axios';

import { baseUrl } from "@/app/routes/adminEstablishment";

export const getEstablishments = async () => {

};


export const getEstablishment = async ({ id }) => {

};

export const createNewEstablishment = async ({ data }) => {
  console.log(data);
  throw 'Error creando el servicio';
};

export const updateEstablishment = async ({ id, data}) => {

};

export const deleteEstablishment = async ({ id }) => {

};