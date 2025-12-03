import { axiosConfig } from "@/app/utils/requestBuilder";
import axios from "axios";

export const getServices = async () => {
    try{
        const headers = axiosConfig();
        const request = await axios.get( '/api/services', headers);
        const data = request.data.data;
        return data;

    }catch(error){
        throw 'No se pudieron recuperar los servicios';
    }
};

export const createService = async (data) => {
    try{
        const headers = await axiosConfig();
        await axios.post( '/api/services',data, headers);
    }catch(err){
        let message = 'Ocurrio un error en el servidor';
        const error = err.response?.data.error;
        if(error){
            if(error == 'A service with that name already exists'){
                message = 'Un servicio ya tiene ese nombre';
            }else if(error == 'Missing required field: type'){
                message = 'No se adjunto el tipo de servicio';
            }
        }
        throw message;
    }
    throw message;
  }
};

export const updateService = async (data,name) => {
    try{
        const headers = await axiosConfig();
        delete data.id;
        await axios.put( '/api/services/'+name,data, headers);
        return null;
    }catch(err){
        let message = 'Ocurrio un error en el servidor';
        throw message;
    }

};

export const createBundle = async (data, servis) => {
  const servs = servis.filter((s) => data.services.includes(s.name));
  let rows = "";
  let duration = 0;

  for (const service of servs) {
    rows =
      rows +
      `
        <tr>
            <td style="padding:6px 8px; width:120px; font-weight:600;">${service.name}</td>
            <td style="padding:6px 8px;">
                ${service.description}
            </td>
        </tr>
          `;
    duration += service.duration;
  }
  const description = `
    <p>${data.description}</p>
    <h3 style="font-size:1.1rem; margin-top:4rem; margin-bottom:0.5rem;">Servicios que incluye</h3>
      <table style="border-collapse:collapse; width:100%; font-family:Arial, sans-serif;">
        <tbody>
            ${rows}
        </tbody>
      </table>
    `;

  data.description = description;
  data.duration = duration;
  data.type = "Paquete";
  const { services, ...newData } = data;
  try {
    await createService(newData);
  } catch (err) {
    throw err;
  }
};

export const getService = async (name) => {
    try{
        const headers = await axiosConfig();
        const uri = '/api/services/'+name;
        const request = await axios.get(uri,headers);
        return request.data;
    }catch(error){
        throw 'Error recuperando servicio';
    }
};

export const deleteService = async (name) => {
    const headers = await axiosConfig();
    const uri = '/api/services/'+name;
    try{
        await axios.delete(uri,headers);
    }catch (err){
        throw "Error en el servidor";
    }
}
