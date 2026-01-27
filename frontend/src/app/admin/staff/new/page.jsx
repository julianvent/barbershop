"use client";
import EmployeeForm from "../../../forms/EmployeeForm";
import { createEmployee } from "../../../apiHandlers/adminStaff";
import Layout from "@/app/components/base_layout/Layout";

export default function NewEmployee() {

  const submit = async(data) => {
    try{
      await createEmployee(data);
    }catch(err){
      return err;
    }
  };
  return (
    <Layout
      headerTitle={"Nuevo empleado"}
      mainTitle={"Registrar nuevo empleado"}
    >
      <title>SG BarberShop - Registrar Empleado</title>
      <EmployeeForm onSubmit={submit} />
    </Layout>
  );
}
