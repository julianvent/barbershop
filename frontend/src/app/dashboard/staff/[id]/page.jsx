'use client';
import Layout from "@/app/components/base_layout/Layout"
import React, { useEffect, useState } from "react"
import { deleteEmployee, getEmployee } from "../api/employees";
import styles from "../EmployeeForm/styles.module.css";
import layout from "../../Main.module.css";
import show from "./styles.module.css";
import { Status } from "@/app/components/form/status/Status";
import { useRouter } from "next/navigation";
import Buttons from "@/app/components/form/model_buttons/Buttons";
export default function EmployeeDetail({params}){
    const router = useRouter();
    const {id} = React.use(params);
    const [employee, setEmployee] = useState(null);
    useEffect(() => {
            async function load() {
                const data = await getEmployee(id);
                setEmployee(data);
            }
            load();
    }, [id]);

    return (
        <Layout>
            
            <div className={layout.layout}>
                <h1>Registro Empleado - Id {id}</h1>
                <div className={styles.columns}>
                    <div className={styles.imageContainer}>
                        <img
                            src={(employee != null) ? '/api/'+employee.image_path : '/image.svg'}
                            alt={"Imagen de" + ((employee != null)? ' '+employee.name: 'l empleado')}
                            className={styles.imageFitBack}
                        />
                    </div>
                    <div className={styles.subFields}>
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
                    </div>

                </div>
                
                {
                        employee&&(<Buttons model={employee} modelType={'staff'}/>
                        )
                }
            </div>
            
        </Layout>
    )
}