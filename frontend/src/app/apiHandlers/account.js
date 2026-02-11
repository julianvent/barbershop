import { axiosConfig, getId } from "@/app/utils/requestBuilder";
import { baseRoute } from "../routes/account";
import axios from "axios";

export async function getAccounts() {
    try{
        const headers = await axiosConfig();
        const request = await axios.get(baseRoute, headers);
        console.log(request.data)
        return request.data.data;
    }catch(err){
        throw 'Error al obtener las cuentas';
    }
}

export async function getAdminAccount(id){
    try{
        const headers = await axiosConfig();
        const uri = baseRoute +'/'+ id;
        const request = await axios.get(uri, headers);
        return request.data;

    }catch(err){
        throw 'Error obteniendo cuenta';
    }

}

export async function getAccount(){
    try{
        const userId = await getId();
        const headers = await axiosConfig();
        const uri = baseRoute +'/'+ userId;
        const request = await axios.get(uri, headers);
        return request.data;

    }catch(err){
        throw 'Error obteniendo cuenta';
    }

}

export async function createAccount(data){
    try {
        const headers = await axiosConfig();
        await axios.post(baseRoute, data, headers);        
    } catch (err) {
        console.log(err)
        throw "Error creando cuenta";
    }
}

export async function updateAdminAccount({data, id}){
    try{
        const headers = await axiosConfig();
        const uri = baseRoute +'/'+ id;
        await axios.put(uri,data, headers);      
    }catch(err){
        return 'Error actualizando los datos de la cuenta'
    }
}


export async function updateAccount(data){
    try{
        const userId = await getId();
        const headers = await axiosConfig();
        const uri = baseRoute +'/'+ userId;
        await axios.put(uri,data, headers);      
    }catch(err){
        return 'Error actualizando los datos'
    }
}


export async function deleteAccount(id){
    try{
        const userId = await getId();
        if(userId == id) throw '1'
        const headers = await axiosConfig();
        const uri = baseRoute +'/'+ id;
        await axios.delete(uri, headers);      
    }catch(err){
        if (err == '1') throw 'No puedes eliminar la cuenta de la sesion activa' 
        throw 'Error eliminando la cuenta'
    }    
}