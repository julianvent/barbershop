'use client';
import CreateNewLayout from "@/app/components/base_layout/CreateNew/CreateNewLayout";
import { staffRoute } from "@/app/utils/routes";
import EmployeeForm from "../../EmployeeForm/EmployeeForm";
import { getEmployee, updateEmployee } from "../../api/employees";
import React, { useState, useEffect }  from "react";
import Layout from "@/app/components/base_layout/Layout";
import styles from '../../EmployeeForm/styles.module.css'

export default function updateStaff({params}){
    const [employee, setEmployee] = useState(null);
    const [message, setMessage] = useState(null);
    const {id} = React.use(params);
    useEffect(() => {
           async function load() {
            try{
                const data = await getEmployee(id);
                setEmployee(data);

            }catch(err){
                setMessage(err);
                console.log(err);
            }
           }
           load();
    }, [id]);


    const submit = async (data) => {
        try{
            await updateEmployee(id, data);
        }catch(err){
            return err.message;
        }
    };

    return (
        <Layout
        headerTitle="Actualizar Empleado"
        mainTitle={"Actualizar registro del empleado - " + (employee ? employee.barber_name : '...')}
        returnRoute={staffRoute}
        >
            <title>SG BarberShop - Actualizar empleado</title>

                            {
                    message&&(
                        <div className={styles.errorMessage}>
                            {message}
                        </div>
                    )
                }
            <EmployeeForm 
            onSubmit={submit}
            employee={employee}/>

        </Layout>
        
    )
}