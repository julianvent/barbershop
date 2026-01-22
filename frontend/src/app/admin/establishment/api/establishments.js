import { axiosConfig } from "@/app/utils/requestBuilder";
import axios from 'axios';

import { getEstablishmentsApiRoute } from "./routes.js";

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