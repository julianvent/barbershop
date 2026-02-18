'use client';
import Layout from "@/app/components/base_layout/Layout";
import React, { useEffect, useState } from "react";
import layout from "../../Main.module.css";
import styles from "./styles.module.css";
import warning from "../../../forms/styles.module.css"
import { getService } from "../../../apiHandlers/adminServices";
import { Status } from "@/app/components/form/status/Status";
import ServiceButtons from "@/app/components/form/model_buttons/ServiceButtons";

export default function ShowService({params, isAdmin}){
    const {id} = React.use(params);
    const [service, setService] = useState(null);
    const [error, setError]= useState(null);
    useEffect(() => {
        async function load() {
                try{
                    const data = await getService(id, isAdmin);
                    console.log(data);
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

                    
                        {(!isAdmin)?(
                            <div className={styles.price}>
                                <p className={styles.labelText}>Precio</p>
                                <p>{service ? `$${service.establishment_services.price.toFixed(2)}` : '...'}</p>
                            </div>
                        ):( 
                            <div className={styles.prices}>
                                <p>Precios asignados al servicio</p>
                                <hr />
                                <ul>
                                    {service?.establishment_services.map((establishment, index) => {
                                        return (
                                            <li className={styles.price} key={index}>
                                                <p className={styles.labelEstablishment}>{establishment.establishment_name}</p>
                                                <p>{service ? `$${establishment.price.toFixed(2)}` : '...'}</p>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                        )}

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
            

                </article>
            
                {
                    service&&(<ServiceButtons model={service} isAdmin={isAdmin}/>
                    )
                }

            </div>

            
        </Layout>
    )
}