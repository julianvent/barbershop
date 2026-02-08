'use client';

import { getEstablishment, updateEstablishment } from "@/app/apiHandlers/adminEstablishments";
import EstablishmentForm from "@/app/forms/EstablishmentForm";
import React, { useEffect, useState } from "react";
import warning from "../../../../forms/styles.module.css"
import Layout from "@/app/components/base_layout/Layout";

export default function UpdateEstablishments({params, isAdmin}){
  const {id} = React.use(params);
  const [establishment, setEstablishment] = useState(null);
  const [err, setErr] = useState(null);

  

  useEffect( () => {
    const load = async () => {
      try {
        const data = await getEstablishment({id});
        delete data.account_id;
        delete data.image_exists;
        setEstablishment(data);
      } catch (e) {
        setErr(e)
      }
    };
    load();
  }, [id])

  const submit = async (id, data) => {
    try{
      await updateEstablishment({id, data})
    } catch (e) {
      return e;
    }
  };



  return (
   <Layout
    headerTitle='Nuevo Establecimiento'
    mainTitle={'Actualizar establecimiento - ' + (establishment ? establishment.name: '...')}
    isAdmin={isAdmin}
    >
      <title>SGBarbershop - Editar establecimiento</title>
        {err?(
              <div className={warning.errorMessage}>
                  {err}
              </div>
        ):(
          <EstablishmentForm onSubmit={submit} establishment={establishment}> </EstablishmentForm>
        )}

   </Layout> 
  )
}