'use client';
import CreateNewLayout from "@/app/components/base_layout/CreateNew/CreateNewLayout";
import { staffRoute } from "@/app/utils/routes";
import EmployeeForm from "../../EmployeeForm/EmployeeForm";
import { getEmployee, updateEmployee } from "../../api/employees";
import React, { useState, useEffect }  from "react";

export default function updateStaff({params}){
    const [employee, setEmployee] = useState(null);
    const {id} = React.use(params);
    useEffect(() => {
           async function load() {
                const data = await getEmployee(id);
                setEmployee(data);
           }
           load();
    }, [id]);


    const submit = async (data) => {
        try{
            await updateEmployee(id, data);
        }catch(err){
            return err;
        }
    };

    return (
        <CreateNewLayout
        title={"Actualizar registro del empleado - " + (employee ? employee.name + ' ' + employee.last_names : '...')}
        returnRoute={staffRoute}
        >
            <EmployeeForm 
            onSubmit={submit}
            employee={employee}/>

        </CreateNewLayout>
        
    )
}