import { axiosConfig } from "@/app/utils/requestBuilder";
import { servicesRoute } from "@/app/utils/routes";
import axios from "axios";
import { redirect } from "next/navigation";

export const getServices = async () => {
    try{
        const headers = axiosConfig();
        const request = await axios.get( '/api/services', headers);
        const data = request.data.data;
        return data;

    }catch(error){
        console.log(error);
    }
};

export const createService = async (data) => {
    try{
        const headers = axiosConfig();
        const request = await axios.post( '/api/services',data, headers);
    }catch(error){
        console.log(error);
    }
};

export const updateService = async (data) => {
    console.log(data);

};

export const createBundle = async (data, servis) => {
    const servs = servis.filter(s => data.services.includes(s.name));
    let rows = '';
    let duration = 0;

    for(const service of servs){
        rows = rows + `          
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
    data.type = 'Paquete';
    const {services, ...newData} = data;
    console.log(newData);
    createService(newData);

};

export const getService = async (name) => {
    try{
        const headers = axiosConfig();
        const uri = '/api/services/'+name;
        const request = await axios.get(uri,headers);
        return request.data;
    }catch(error){
        console.log(error);
    }
};

export const deleteService = async (id) => {
    console.log('Eliminando servicio ' + id)
}