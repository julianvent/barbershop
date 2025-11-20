import { servicesEntries } from "@/app/utils/data";

export const createService = async (data) => {
    console.log(data);

};

export const updateService = async (data) => {
    console.log(data);

};

export const createBundle = async (data) => {
    console.log(data);

};

export const getService = async (id) => {
    for(const service of servicesEntries){
        if(id == service.id){
            return service;
        }
    }

    return null;
};

export const deleteService = async (id) => {
    console.log('Eliminando servicio ' + id)
}