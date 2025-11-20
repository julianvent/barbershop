"use client";
import EmployeeForm from "../EmployeeForm/EmployeeForm";
import { createEmployee } from "../api/employees";
import Layout from "@/app/components/base_layout/Layout";

export default function NewEmployee() {
  return (
    <Layout
      headerTitle={"Nuevo empleado"}
      mainTitle={"Registrar nuevo empleado"}
    >
      <EmployeeForm onSubmit={createEmployee} />
    </Layout>
  );
}
