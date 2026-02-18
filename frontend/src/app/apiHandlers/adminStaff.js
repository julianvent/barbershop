import { axiosConfig, getEstablishmentId } from "@/app/utils/requestBuilder";
import axios from "axios";
import { baseUrl } from "../routes/adminStaff";

export const getEmployees = async () => {
    try{
        const headers = await axiosConfig();
        const response = await axios.get(baseUrl + '?limit=50', headers);
        return response.data;
    }catch(err){
        throw 'No se pudieron recuperar los barberos';
    }
};

export const getEmployeesByEstablishment = async (establishment_id) => {
    try{
        const headers = await axiosConfig();
        const response = await axios.get(baseUrl + `?establishment_id=${establishment_id}`, headers);
        return response.data;
    }catch(err){
        throw 'No se pudieron recuperar los barberos de este establecimiento';
    }
}

export const createEmployee = async (data, isAdmin) => {
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
        
        if (!isAdmin) {
            const establishmentId = await getEstablishmentId();
            formData.append("establishment_id", establishmentId);
        } else {
            formData.append("establishment_id", data.establishment_id);
        }
        

      await axios.post(baseUrl , formData, headers);

    } catch (err) {
      throw 'Error al registrar el empleado';
    }
};

export const getEmployee = async (id) => {
    try{
      const headers = await axiosConfig();
      const response = await axios.get(baseUrl + id, headers);
      return response.data;
    }catch(err){
      if (error.response.status == 403) redirect('/forbidden')
      throw 'Error al recuperar el empleado';
    }

};

export const updateEmployee = async (id,data, isAdmin) => {
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

        if (!isAdmin) {
            const establishmentId = await getEstablishmentId();
            formData.append("establishment_id", establishmentId);
        } else {
            formData.append("establishment_id", data.establishment_id);
        }

        await axios.put(baseUrl + id, formData, headers);
    }catch(err){
        throw 'Error al actualizar el empleado';
    }

};

export const deleteEmployee = async (id) =>{
    try{
        const headers = await axiosConfig();
        await axios.delete(baseUrl + id, headers);
    }catch(err){
        throw 'Error al eliminar el registro del empleado';
    }

}
