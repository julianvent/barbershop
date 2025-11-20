'use client';
import Layout from "@/app/components/base_layout/Layout";
import React, { useEffect, useState } from "react";
import layout from "../../Main.module.css";
import styles from "./styles.module.css";
import { getService } from "../api/services";
import Buttons from "@/app/components/form/model_buttons/Buttons";

export default function showService({params}){
    const {id} = React.use(params);
    const [service, setService] = useState(null);
    useEffect(() => {
            async function load() {
                const data = await getService(id);
                setService(data);
            }
            load();
        }, [id]);
        
    return (
        <Layout>
            <div className={layout.layout}>
                <h1>{service ? ((service.tipo == 'Paquete' ? 'Paquete': 'Servicio') + ' - ' + service.name):' Cargando'}</h1>
            
            <div>
                {
                    service&&(<div
                    dangerouslySetInnerHTML={{__html: service.descripcion.trim()}}/>
                    )
                }
            
                <div className={styles.price}>
                    <p className={styles.labelText}>Precio</p>
                    <p>{service ? service.precio : '...'}</p>
                </div>

                {service ? ((service.tipo != 'Paquete' ? (
                    <div className={styles.price}>
                        <p className={styles.labelText}>Tipo</p>
                        <p>{service ? service.tipo : '...'}</p>
                    </div>
                ): '')):''}

            
            </div>
            
            {
                    service&&(<Buttons id={service.id} modelType={'service'} service={service.tipo}/>
                    )
            }
            
            


            </div>
            
        </Layout>
    )
}