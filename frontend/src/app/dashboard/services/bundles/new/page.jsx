"use client";
import { servicesRoute } from "@/app/utils/routes";
import BundleForm from "../../ServiceForm/BundleForm";
import { createBundle } from "../../api/services";
import Layout from "@/app/components/base_layout/Layout";

export default function NewService() {
  return (
    <Layout
      headerTitle={"Nuevo paquete"}
      mainTitle={"Registrar nuevo paquete"}
      returnRoute={servicesRoute}
    >
      <BundleForm onSubmit={createBundle}></BundleForm>
    </Layout>
  );
}
