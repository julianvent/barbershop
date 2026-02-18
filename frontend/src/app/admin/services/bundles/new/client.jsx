"use client";
import BundleForm from "../../../../forms/BundleForm";
import { createBundle } from "../../../../apiHandlers/adminServices";

export default function NewService({isAdmin, establishmentId}) {

  const submit = async (data, services) => {
    try{
      await createBundle(data,services, isAdmin);
    }catch(err){
      return err;
    }
  };
  return (
    <>
      <BundleForm onSubmit={submit} establishmentId={establishmentId}></BundleForm>
    </>
  );
}
