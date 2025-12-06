import { axiosConfig, getId } from "@/app/utils/requestBuilder";
import { baseRoute } from "./routes";
import axios from "axios";

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
