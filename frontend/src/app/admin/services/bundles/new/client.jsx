"use client";
import BundleForm from "../../../../forms/BundleForm";
import { createBundle } from "../../../../apiHandlers/adminServices";

export default function NewService() {

  const submit = async (data, services) => {
    try{
      await createBundle(data,services);
    }catch(err){
      return err;
    }
  };
  return (
    <>
      <title>SG BarberShop - Crear Paquetes</title>
      <BundleForm onSubmit={submit}></BundleForm>
    </>
  );
}
