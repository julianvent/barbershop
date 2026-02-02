"use client";
import EmployeeForm from "../../../forms/EmployeeForm";
import { createEmployee } from "../../../apiHandlers/adminStaff";
export default function NewEmployee() {

  const submit = async(data) => {
    try{
      await createEmployee(data);
    }catch(err){
      return err;
    }
  };
  return (
    <EmployeeForm onSubmit={submit} />
  );
}
