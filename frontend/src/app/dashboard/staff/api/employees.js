import { indexBarbers } from "@/app/utils/data";

export const createEmployee = async (data) =>{
    console.log(data);

}

export const getEmployee = async (id) => {
    for(const employee of indexBarbers){
        if(id == employee.id){
            return employee;
        }
    }

    return null;

};

export const updateEmployee = async (id,data) => {
    console.log(data);
      
};

export const deleteEmployee = async (id) =>{
    console.log('Eliminando '+ id);
    
}
