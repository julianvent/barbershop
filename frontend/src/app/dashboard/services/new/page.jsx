"use client";
import { redirect } from "next/navigation";
import ServiceForm from "../ServiceForm/ServiceForm";
import { createService } from "../api/services";
import Layout from "@/app/components/base_layout/Layout";
import { servicesRoute } from "@/app/utils/routes";
import { useRouter } from "next/navigation";

export default function NewService() {
  const router = useRouter();

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
      <ServiceForm onSubmit={submit}></ServiceForm>
    </Layout>
  );
}
