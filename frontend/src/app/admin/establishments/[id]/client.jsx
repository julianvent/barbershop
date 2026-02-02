'use client';
import { getEstablishment } from "@/app/apiHandlers/adminEstablishments";
import React, { useEffect, useState } from "react";
import warning from '@/app/forms/styles.module.css';
import layout from '@/app/admin/Main.module.css';
import styles from '@/app/forms/EmployeeFormStyles.module.css';
import Buttons from "@/app/components/form/model_buttons/Buttons";
import Layout from "@/app/components/base_layout/Layout";

export default function Establishment({params, isAdmin}){
  const {id} = React.use(params)
  const [err, setErr] = useState(null);
  const [establishment, setEstablishment] = useState(null);

  useEffect(() =>{
    const load = async () => {
      try {
        const location = await getEstablishment({id});
        setEstablishment(location)
      } catch (error) {
        setErr(error)
      }

    }

    load()
  }, [])
  return (
    <Layout isAdmin={isAdmin}
      headerTitle='Ver Establecimiento'
      mainTitle={'Ver establecimiento - ' + (establishment ? establishment.name: '...')}>
        <title>SG Barbershop - Ver Establecimiento</title>
        {err?(
              <div className={warning.errorMessage}>
                  {err}
              </div>
        ): establishment?(

          <div className={layout.layoutShow}>
            <div className={styles.columns}>
              <div className={styles.imageContainer}>
                <img
                    src={(establishment != null) ? establishment.image_path : '/image.svg'}
                    alt={"Imagen de" + ((establishment != null)? ' '+ establishment.name: 'l establecimiento')}
                    className={styles.imageFitBack}
                />
              </div>

              <article className={styles.subfields}>
                <div className={styles.row}>
                  <div>
                    <p><strong>Estado</strong></p>
                    <p>{establishment.state}</p>
                  </div>

                  <div>
                    <p><strong>Ciudad</strong></p>
                    <p>{establishment.city}</p>
                  </div>

                </div>

                <div className={styles.row}>

                  <div>
                    <p><strong>Calle</strong></p>
                    <p>{establishment.street}</p>
                  </div>
                  <div>
                    <p><strong>Codigo Postal</strong></p>
                    <p>{establishment.postal_code}</p>
                  </div>

                </div>

                <div className={styles.row}>

                  <div>
                    <p><strong>Numero Externo</strong></p>
                    <p>{establishment.ext_number ? establishment.ext_number :'S/N'}</p>
                  </div>

                  <div>
                    <p><strong>Numero Interno</strong></p>
                    <p>{establishment.int_number? establishment.int_number :'S/N'}</p>
                  </div>
                </div>

                <div className={styles.row}>

                  <div>
                    <p><strong>Telefono</strong></p>
                    <p>{establishment.phone_number}</p>
                  </div>
                  <div>
                    <p><strong>Administrado por:</strong></p>
                    <p>{establishment.account_name ? establishment.account_name : 'N/A'}</p>
                  </div>

                </div>


                
              </article>
            </div>

            <Buttons model={establishment} modelType="establishment"/>

          </div>

        ):
        (<div>
          <p>Cargando...</p>
        </div>)}
    </Layout>
  )
}