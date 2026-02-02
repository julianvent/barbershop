"use client";
import { createNewEstablishment } from "@/app/apiHandlers/adminEstablishments";
import EstablishmentForm from "@/app/forms/EstablishmentForm";

export default function CreateEstablishment() {
  const submit = async (data) => {
    try{
      await createNewEstablishment({data});
    }catch(e){
      return e;
    }
  };

  return (
    <>
      <title>SGBarbershop - Crear establecimiento</title>
      <EstablishmentForm onSubmit={submit}> </EstablishmentForm>
    </>
  )
}