'use client';
import Layout from "@/app/components/base_layout/Layout";
import styles from "../../Main.module.css"
import EstablishmentForm from "../EstablishmentForm/EstablishmentForm";
import { createEstablishmentsApiRoute } from "../api/routes";
import { createNewEstablishment } from "../api/establishments";
export default function createEstablishment () {
  
  const submit = async (data) => {
    try{
      await createNewEstablishment({data});
    }catch(e){
      return e;
    }
  };

  return (
   <Layout
    headerTitle='Nuevo Establecimiento'
    mainTitle='Registrar nuevo establecimiento'
    >
      <title>SGBarbershop - Crear establecimiento</title>
      <EstablishmentForm onSubmit={submit}> </EstablishmentForm>

   </Layout> 
  )
}