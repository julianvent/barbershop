"use client";
import EmployeeForm from "../../../forms/EmployeeForm";
import { createEmployee } from "../../../apiHandlers/adminStaff";
export default function NewEmployee({isAdmin}) {

  const submit = async(data) => {
    try{
      await createEmployee(data, isAdmin);
    }catch(err){
      return err;
    }
  };
  return (
    <EmployeeForm onSubmit={submit} isAdmin={isAdmin} />
  );
}
