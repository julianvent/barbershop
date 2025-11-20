"use client";
import CreateNewLayout from "@/app/components/base_layout/CreateNew/CreateNewLayout";
import { servicesRoute } from "@/app/utils/routes";
import ServiceForm from "../../ServiceForm/ServiceForm";
import { updateService, getService } from "../../api/services";
import React, { useEffect, useState } from "react";

export default function updateServices({params}) {
    const [service, setService] = useState(null);
    const { id } = React.use(params);
    useEffect(() => {
       async function load() {
            const data = await getService(id);
            setService(data);
       }
       load();
       console.log(service)
    }, [id]);
  return (
    <CreateNewLayout
      title={"Actualizar servicio - " + (service == null ? "Cargando..." : service.name) }
      returnRoute={servicesRoute}
    >
      <ServiceForm
        onSubmit={updateService}
        service={service}
      ></ServiceForm>
    </CreateNewLayout>
  );
}
