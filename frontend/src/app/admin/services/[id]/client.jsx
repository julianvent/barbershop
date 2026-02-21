'use client';
import Layout from "@/app/components/base_layout/Layout";
import React, { useEffect, useState } from "react";
import layout from "../../Main.module.css";
import styles from "./styles.module.css";
import warning from "../../../forms/styles.module.css"
import { getService } from "../../../apiHandlers/adminServices";
import Buttons from "@/app/components/form/model_buttons/Buttons";

export default function ShowService({params, isAdmin}){
    const {id} = React.use(params);
    const [service, setService] = useState(null);
    const [error, setError]= useState(null);
    useEffect(() => {
        async function load() {
                try{
                    const data = await getService(id, isAdmin);
                    setService(data);

                }catch(err){
                    setError(err);
                }
            }
            load();
        }, [id]);
        
    return (
        <Layout 
            headerTitle={'Ver ' + (service? (service.type == 'Paquete' ? 'Paquete': 'Servicio') :'...')} 
            mainTitle={service ? ((service.type == 'Paquete' ? 'Paquete': 'Servicio') + ' - ' + service.name):' Cargando'}
            isAdmin={isAdmin}>
            <title>SG BarberShop - Servicio</title>
            <div className={layout.layoutShow}>
                <article>
                    <div aria-label="Atributos del servicio">
                        <p><strong>Descripcion: </strong></p>
                        {
                            service&&(<article aria-label="Descripción del servicio"
                                dangerouslySetInnerHTML={{__html: service.description.trim()}}/> )
                            }
        
                        {
                            error&&(
                                <div className={warning.errorMessage}>
                                    {error}
                                </div>
                            )
                        }

                    
                        <div className={styles.price}>
                            <p className={styles.labelText}>Precio</p>
                            <p>{service ? `$${service.price.toFixed(2)}` : '...'}</p>
                        </div>

                        <div className={styles.price}>
                            <p className={styles.labelText}>Duracion Aproximada</p>
                            <p>{service ? Math.floor(service.duration/60) > 1 ? Math.floor(service.duration/60) + ' hr ' + service.duration%60 + ' minutos' : service.duration + ' minutos' : '...'}</p>
                        </div>


                        {service ? ((service.tipo != 'Paquete' ? (
                            <div className={styles.price}>
                                <p className={styles.labelText}>Tipo</p>
                                <p>{service ? service.type : '...'}</p>
                            </div>
                        ): '')):''}

                    
                    </div>
            

                </article>
            
                {
                    service&&(<Buttons model={service} modelType="service" isAdmin={isAdmin}/>
                    )
                }

            </div>

            
        </Layout>
    )
}