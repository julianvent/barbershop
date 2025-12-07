'use client';
import Layout from "@/app/components/base_layout/Layout"
import React, { useEffect, useState } from "react"
import styles from "../EmployeeForm/styles.module.css";
import layout from "../../Main.module.css";
import show from "./styles.module.css";
import { Status } from "@/app/components/form/status/Status";
import Buttons from "@/app/components/form/model_buttons/Buttons";
import { getEmployee } from "../api/employees";
export default function EmployeeDetail({params}){
    const {id} = React.use(params);
    const [employee, setEmployee] = useState(null);
    const [message, setMessage] = useState(null);
    useEffect(() => {
            async function load() {
                try{
                    const data = await getEmployee(id);
                    setEmployee(data);

                }catch(err){
                    console.log(err);
                    setMessage(err);
                }
            }
            load();
    }, [id]);

    return (
        <Layout headerTitle={'Barbero No.'+(employee?employee.id:'')}>
            <title>SG BarberShop - Ver Empleado</title>

            <div  className={layout.layout}>
            
                <div className={styles.header}>
                    <h1>Empleado - ID {id}</h1>

                    {
                        message&&(
                            <div className={styles.errorMessage}>
                                {message}
                            </div>
                        )
                    }
                </div>
                <div className={styles.columns}>
                    <div className={styles.imageContainer}>
                        <img
                            src={(employee != null) ? employee.image_path : '/image.svg'}
                            alt={"Imagen de" + ((employee != null)? ' '+ employee.barber_name: 'l empleado')}
                            className={styles.imageFitBack}
                        />
                    </div>
                    <article className={styles.subFields}>
                        <div className={styles.row}>
                            <div>
                                <p className={show.labelText}>Nombre Completo </p>
                                <p>{(employee != null)?employee.barber_name: '...'}</p>
                            </div>
                            
                        </div>

                        <div className={styles.row}>
                            <div>
                                <p className={show.labelText}>Correo</p>
                                <p>{(employee != null)?employee.email: '...'}</p>
                            </div>

                            <div>
                                <p className={show.labelText}>Telefono</p>
                                <p>{(employee != null)?employee.phone: '...'}</p>
                            </div>
                            
                        </div>

                        <div className={styles.row}>
                            <div className={show.statusContainer}>
                                <p className={show.labelText}>Estado</p>

                                {employee && <Status id="state" state={employee.is_active ? 'active' : 'inactive'} type={"barber"} />}

                            </div>
                        </div>
                        
                    </article>

                </div>
                
                {
                        employee&&(<Buttons model={employee} modelType={'staff'}/>
                        )
                }
            </div>
        </Layout>
    )
}