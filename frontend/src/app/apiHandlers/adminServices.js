import { axiosConfig, getEstablishmentId } from "@/app/utils/requestBuilder";
import axios from "axios";
import {
  createServiceApiRoute,
  deleteServiceApiRoute,
  getServicesApiRoute,
  updateServiceApiRoute,
} from "../routes/adminServices";
import { redirect } from "next/navigation";

export const getServices = async () => {
  try {
    const headers = axiosConfig();
    const request = await axios.get(getServicesApiRoute, headers);
    const data = request.data.data;
    return data;
  } catch (error) {
    throw "No se pudieron recuperar los servicios";
  }
};


export const getServicesByEstablishment = async (establishmentId) => {
  try {
    const headers = axiosConfig();
    const request = await axios.get(getServicesApiRoute + `?establishment_id=${establishmentId}`, headers);
    const data = request.data.data;
    return data;
  } catch (error) {
    throw "No se pudieron recuperar los servicios de este establecimiento";
  }  
}

export const createService = async (data, isAdmin) => {
  try {
    const headers = await axiosConfig();
    if (!isAdmin) {
      const establishmentId = await getEstablishmentId();
      data.establishment_id = establishmentId;
    }

    await axios.post(createServiceApiRoute, data, headers);
  } catch (err) {
    let message = "Ocurrio un error en el servidor";
    const error = err.response?.data.error;
    if (error) {
      if (error == "A service with that name already exists") {
        message = "Un servicio ya tiene ese nombre";
      } else if (error == "Missing required field: type") {
        message = "No se adjunto el tipo de servicio";
      }
    }
    throw message;
  }
};

export const updateService = async (data, name, isAdmin) => {
  try {
    const headers = await axiosConfig();
    let establishment = '';
    delete data.id;
    delete data.establishment_id;

    if(!isAdmin){
      const establishmentId = await getEstablishmentId();
      data.establishment_id = establishmentId;
    }

    if(data.establishment_id){
      establishment = `/?establishment_id=${data.establishment_id}`;
    }

    delete data.Establishment_id;
    delete data.Establishment;

    await axios.put(updateServiceApiRoute + name + establishment, data, headers);
    return null;
  } catch (err) {
    console.log(err)
    let message = "Ocurrio un error en el servidor";
    throw message;
  }
};

export const createBundle = async (data, servis, isAdmin) => {
  const servs = servis.filter((s) => data.services.includes(s.name));
  let rows = "";
  let duration = 0;

for (const service of servs) {
  rows += `
    <tr>
      <td style="padding:6px 8px; width:120px;">${service.name}</td>
      <td style="padding:6px 8px;">${service.description}</td>
    </tr>
  `;
  duration += service.duration;
}

const description = `
  <p>${data.description}</p>


  <table style="border-collapse:collapse; width:100%; font-family:Arial, sans-serif;">
    <caption style="text-align:left; font-weight:600; padding:8px 0;">
      Servicios incluidos
    </caption>

    <thead>
      <tr style="text-align: left;">
        <th scope="col" style="padding:6px 8px; width:120px; font-weight:600;">
          Servicio
        </th>
        <th scope="col" style="padding:6px 8px; font-weight:600;">
          Descripcion
        </th>
      </tr>
    </thead>

    <tbody>
      ${rows}
    </tbody>
  </table>
`;

  if (!isAdmin) {
    const establishmentId = await getEstablishmentId();
    data.establishment_id = establishmentId;
  }

  data.description = description;
  data.duration = duration;
  data.type = "Paquete";
  const { services, ...newData } = data;
  try {
    await createService(newData, isAdmin);
  } catch (err) {
    throw err;
  }
};

export const getService = async (name, isAdmin) => {
  try {
    const headers = await axiosConfig();
    let uri = getServicesApiRoute + name;
    if(!isAdmin){
      const establishment = await getEstablishmentId();
      uri = uri + `/?establishment_id=${establishment}`
    }
    const request = await axios.get(uri, headers);
    return request.data;
  } catch (error) {
    if (error.response.status == 403) redirect('/forbidden')
    throw "Error recuperando servicio";
  }
};

export const deleteService = async ({id, isAdmin, establishment_id}) => {
  const headers = await axiosConfig();
  let uri = deleteServiceApiRoute + id;
  let establishment = establishment_id;
  if(!isAdmin){
    establishment = await getEstablishmentId();
  }

  if(establishment){
    uri = uri + `/?establishment_id=${establishment}`
  }
  try {
    await axios.delete(uri, headers);
  } catch (err) {
    throw "Error en el servidor";
  }
};
