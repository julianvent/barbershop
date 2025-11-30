'use client';
import Layout from "@/app/components/base_layout/Layout";
import layout from "../../Main.module.css";
import React, { useEffect, useState } from "react";
import { getAppointment } from "../api/appointments";
import styles from "./styles.module.css";
import { getService } from "../../services/api/services";
import { Status } from "@/app/components/form/status/Status";
import Buttons from "@/app/components/form/model_buttons/Buttons";

export default function showAppointment({params}){
    const {id} = React.use(params);
    const [appointment, setAppointment] = useState(null);
    const [services, setServices] = useState([]);

    useEffect( () => {
        async function requestAppointmentInfo(id) {
            const data = await getAppointment({appointmentId:id});
            setAppointment(data)

            for (const service of data.services) {
                const serv = await getService(service);
                setServices(prev => [...prev, serv]);
                
            }
        }

        requestAppointmentInfo(id);
    }, [id]);


    console.log(services);
    function formatDate(date){
        const dayNames = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    
        const objectDate = new Date(date);
        const day = dayNames[objectDate.getDay()];
        const month = objectDate.toLocaleDateString('es-ES', { month: 'long' });
        const monthFormated = month.charAt(0).toUpperCase() + month.slice(1);
        return `${day} ${objectDate.getDate()} de ${monthFormated} del ${objectDate.getFullYear()}` ;
    }
    return (
            <Layout>
                <div className={layout.layout}>
                    <h2>Detalles Cita - { appointment && (formatDate(appointment.date))}</h2>

                        <div className={styles.columns}>
                            
                            {(appointment != null && appointment.status == 'completed')&&(
                                <div className={styles.imageContainer}>
                                    <img
                                        src={appointment.photo ? appointment.photo : 'https://reservoimg.s3.amazonaws.com/fotos_blog/fd1fb362-b_foto_blog.jpg'}
                                        alt={"Imagen de la cita "}
                                        className={styles.imageFitBack}
                                    />
                                </div>
                            )}
                            

                            <div>
                                <div style={{marginTop: '2%'}}>
                                    <h3>Datos del cliente</h3>
                                    <div className={styles.row}>
                                        <div className={styles.field}>
                                            <label htmlFor="name">Nombre</label>
                                            {appointment && ( <p>{appointment.customer}</p>)}
                                        </div>

                                        <div className={styles.field}>
                                            <label htmlFor="phone">Telefono</label>
                                            {appointment && ( <p>{appointment.phone}</p>)}
                                        </div>
                                    </div>
                                </div>

                                <div style={{marginTop: '2%'}}>
                                    <h3>Datos de la cita</h3>
                                    <div className={styles.row}>
                                        <div className={styles.field}>
                                            <label htmlFor="time">Fecha Estimada</label>
                                            {appointment && ( <p>{appointment.date}</p>)}
                                        </div>

                                        <div className={styles.field}>
                                            <label htmlFor="date">Hora Estimada</label>
                                            {appointment && ( <p>{appointment.time}</p>)}
                                        </div>

                                        <div className={styles.field}>
                                            <label htmlFor="date">Estado</label>
                                            {appointment && <Status id="state" state={appointment.status} type={"appointment"} />}
                                        </div>

                                    </div>

                                </div>

                            </div>                       
                        </div>
                        
                        <div className={styles.columns}>
                            <div>
                            <h3>Servicios Ofrecidos</h3>
                            <div className={styles.table}>
                                <table>
                                    <tbody>
                                        {services.map(e => {
                                            if(e.tipo == 'Paquete'){     
                                                return (
                                                    <tr key={e.id}>
                                                        <td>{e.name}</td>
                                                        <td  className={styles.noBold}>

                                                            <div
                                                                dangerouslySetInnerHTML={{
                                                                    __html: e.descripcion.trim()
                                                                }}
                                                            />
                                                        </td>
                                                    </tr>
                                                );          
                                            }else{
                                                return(
                                                    <tr key={e.id}>
                                                        <td>{e.name}</td>
                                                        <td>{e.descripcion}</td>
                                                    </tr>
                                                );

                                            }

                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        </div>

                    {appointment&&(<Buttons model={appointment} modelType={'appointment'}/> ) }                
                </div>
            </Layout>
    )
}