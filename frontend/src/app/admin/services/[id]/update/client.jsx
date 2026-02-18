"use client";
import ServiceForm from "../../../../forms/ServiceForm";
import { updateService, getService } from "../../../../apiHandlers/adminServices";
import React, { useEffect, useState } from "react";
import Layout from "@/app/components/base_layout/Layout";
import warning from "../../../../forms/styles.module.css"

export default function UpdateServices({params, isAdmin}) {
    const [service, setService] = useState(null);
    const [error, setError] = useState(null);
    const [isOnlyOne, setIsOnlyOne] = useState(false)
    const { id } = React.use(params);
    useEffect(() => {
       async function load() {
            try{
              const data = await getService(id, isAdmin);
              if(isAdmin){
                setIsOnlyOne(data.establishment_services.length == 1 || data.establishment_services.length == 0 )
              } 
              setService(data);
            }catch(err){
              setError(err);
            }
       }
       load();
    }, [id]);

    const submit = async (data) => {
      try{
        await updateService(data,id, isAdmin);
      }catch(err){
        return err;
      }
    };
  return (
    <Layout
      mainTitle={"Actualizar servicio - " + (service == null ? "Cargando..." : service.name) }
      headerTitle="Editar Servicios y Paquetes"
      isAdmin={isAdmin}
    >
      <title>SG BarberShop - Actualizar Servicios</title>
      {
          error&&(
              <div className={warning.errorMessage}>
                  {error}
              </div>
          )
      }
      <ServiceForm
        onSubmit={submit}
        service={service}
        isAdmin={isAdmin}
        isOnlyOne={isOnlyOne}
      ></ServiceForm>
      
    </Layout>
  );
}
