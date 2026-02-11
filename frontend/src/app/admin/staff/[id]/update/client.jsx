'use client';
import EmployeeForm from "../../../../forms/EmployeeForm";
import { getEmployee, updateEmployee } from "@/app/apiHandlers/adminStaff";
import React, { useState, useEffect }  from "react";
import Layout from "@/app/components/base_layout/Layout";
import styles from '../../../../forms/EmployeeFormStyles.module.css'

export default function UpdateStaff({params, isAdmin}){
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
            }
           }
           load();
    }, [id]);


    const submit = async (data) => {
        try{
            await updateEmployee(id, data, isAdmin);
        }catch(err){
            return err.message;
        }
    };

    return (
        <Layout
        headerTitle="Actualizar Empleado"
        mainTitle={"Actualizar registro del empleado - " + (employee ? employee.barber_name : '...')}
        isAdmin={isAdmin}
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
            employee={employee}
            isAdmin={isAdmin}/>

        </Layout>
        
    )
}