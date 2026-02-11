"use client";
import ServiceForm from "../../../forms/ServiceForm";
import { createService } from "../../../apiHandlers/adminServices";

export default function NewService({isAdmin}) {

  const submit = async (data) => {
    try{
      await createService(data, isAdmin);
    }catch(err){
      return err;
    }
  };

  return (
    <>
      <title>SG BarberShop - Crear Servicio</title>
      <ServiceForm onSubmit={submit} isAdmin={isAdmin}></ServiceForm>
    </>
  );
}
