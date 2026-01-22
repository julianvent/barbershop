"use client";
import { servicesRoute } from "@/app/utils/routes";
import BundleForm from "../../../forms/BundleForm";
import { createBundle } from "../../api/services";
import Layout from "@/app/components/base_layout/Layout";

export default function NewService() {

  const submit = async (data, services) => {
    try{
      await createBundle(data,services);
    }catch(err){
      return err;
    }
  };
  return (
    <Layout
      headerTitle={"Nuevo paquete"}
      mainTitle={"Registrar nuevo paquete"}
      returnRoute={servicesRoute}
    >
      <title>SG BarberShop - Crear Paquetes</title>
      <BundleForm onSubmit={submit}></BundleForm>
    </Layout>
  );
}
