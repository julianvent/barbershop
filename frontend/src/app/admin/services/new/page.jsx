"use client";
import ServiceForm from "../../forms/ServiceForm";
import { createService } from "../api/services";
import Layout from "@/app/components/base_layout/Layout";

export default function NewService() {

  const submit = async (data) => {
    try{
      await createService(data);
    }catch(err){
      return err;
    }
  };

  return (
    <Layout
      headerTitle={"Nuevo servicio"}
      mainTitle={"Registrar nuevo servicio"}
    >
      <title>SG BarberShop - Crear Servicio</title>
      <ServiceForm onSubmit={submit}></ServiceForm>
    </Layout>
  );
}
