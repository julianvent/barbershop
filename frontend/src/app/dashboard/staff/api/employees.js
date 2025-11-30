import { axiosConfig } from "@/app/utils/requestBuilder";
import axios from "axios";

export const getEmployees = async () => {
    try{
        const headers = await axiosConfig();
        const response = await axios.get('/api/barbers?limit=50', headers);
        return response.data;
    }catch(err){
        throw err;
    }
};

export const createEmployee = async (data) => {
    try {
        const headers = await axiosConfig();
        delete headers.headers["Content-Type"];


        const formData = new FormData();

        formData.append("barber_name", data.barber_name);
        formData.append("email", data.email);
        formData.append("phone", data.phone);
        formData.append("is_active", data.is_active == 'active' ? 'true' : 'false');

        if (data.image && data.image.length > 0) {
            formData.append("image", data.image[0]);
        }

        await axios.post('/api/barbers', formData, headers);

    } catch (err) {
        throw 'Error al registrar el cliente';
    }
};

export const getEmployee = async (id) => {
    try{
        const headers = axiosConfig();
        const response = await axios.get('/api/barbers/'+id, headers);
        return response.data;
    }catch(err){
        throw 'Error al recuperar el cliente';
    }

};

export const updateEmployee = async (id,data) => {
    try{
        const headers = await axiosConfig();
        delete headers.headers["Content-Type"];


        const formData = new FormData();

        formData.append("barber_name", data.barber_name);
        formData.append("email", data.email);
        formData.append("phone", data.phone);
        formData.append("is_active", data.is_active == 'active' ? 'true' : 'false');

        if (data.image && data.image.length > 0) {
            formData.append("image", data.image[0]);
        }

        await axios.put('/api/barbers/'+id, formData, headers);
    }catch(err){
        throw 'Error al actualizar el empleado';
    }

};

export const deleteEmployee = async (id) =>{
    try{
        const headers = await axiosConfig();
        await axios.delete('/api/barbers/'+id, headers);
    }catch(err){
        throw 'Error al eliminar el registro del empleado';
    }

}
