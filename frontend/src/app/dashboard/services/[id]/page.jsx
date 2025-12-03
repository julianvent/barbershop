'use client';
import Layout from "@/app/components/base_layout/Layout";
import React, { useEffect, useState } from "react";
import layout from "../../Main.module.css";
import styles from "./styles.module.css";
import warning from "../ServiceForm/styles.module.css"
import { getService } from "../api/services";
import Buttons from "@/app/components/form/model_buttons/Buttons";
import { Status } from "@/app/components/form/status/Status";

export default function showService({params}){
    const {id} = React.use(params);
    const [service, setService] = useState(null);
    const [error, setError]= useState(null);
    useEffect(() => {
        async function load() {
                try{
                    const data = await getService(id);
                    setService(data);

                }catch(err){
                    setError(err);
                }
            }
            load();
        }, [id]);
        
    return (
        <Layout headerTitle={'Ver ' + (service? (service.type == 'Paquete' ? 'Paquete': 'Servicio') :'...')}>
            <div className={layout.layout}>
                <article className={styles.fieldsContainer}>
                <h1>{service ? ((service.type == 'Paquete' ? 'Paquete': 'Servicio') + ' - ' + service.name):' Cargando'}</h1>
            
                <div>
                    {
                        service&&(<article className={styles.htmlContent} aria-label="Descripción del servicio"
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
                        <p>{service ? service.price.toFixed(2) : '...'}</p>
                    </div>

                    <div className={styles.price}>
                        <p className={styles.labelText}>Duracion Aproximada</p>
                        <p>{service ? Math.floor(service.duration/60) > 1 ? Math.floor(service.duration/60) + ' hr ' + service.duration%60 + ' minutos' : service.duration + ' minutos' : '...'}</p>
                    </div>

                    <div className={styles.price}>
                        <p className={styles.labelText}>Estado</p>
                        {service && <Status id="state" state={service.status} name={'N/A'} />}
                    </div>


                    {service ? ((service.tipo != 'Paquete' ? (
                        <div className={styles.price}>
                            <p className={styles.labelText}>Tipo</p>
                            <p>{service ? service.type : '...'}</p>
                        </div>
                    ): '')):''}

                
                </div>
            
                {
                        service&&(<Buttons model={service} modelType={'service'}/>
                        )
                }

                </article>
            </div>

            
        </Layout>
    )
}