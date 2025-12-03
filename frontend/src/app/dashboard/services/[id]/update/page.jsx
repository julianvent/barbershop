"use client";
import CreateNewLayout from "@/app/components/base_layout/CreateNew/CreateNewLayout";
import { servicesRoute } from "@/app/utils/routes";
import ServiceForm from "../../ServiceForm/ServiceForm";
import { updateService, getService } from "../../api/services";
import React, { useEffect, useState } from "react";
import Layout from "@/app/components/base_layout/Layout";
import warning from "../../ServiceForm/styles.module.css"

export default function updateServices({params}) {
    const [service, setService] = useState(null);
    const [error, setError] = useState(null);
    const { id } = React.use(params);
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

    const submit = async (data) => {
      try{
        await updateService(data,id);
      }catch(err){
        return err;
      }
    };
  return (
    <Layout
      mainTitle={"Actualizar servicio - " + (service == null ? "Cargando..." : service.name) }
      headerTitle="Editar Servicios y Paquetes"
    >
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
      ></ServiceForm>
      
    </Layout>
  );
}
