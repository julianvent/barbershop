"use client";
import ServiceForm from "../ServiceForm/ServiceForm";
import { createService } from "../api/services";
import Layout from "@/app/components/base_layout/Layout";

export default function NewService() {
  return (
    <Layout
      headerTitle={"Nuevo servicio"}
      mainTitle={"Registrar nuevo servicio"}
    >
      <ServiceForm onSubmit={createService}></ServiceForm>
    </Layout>
  );
}
