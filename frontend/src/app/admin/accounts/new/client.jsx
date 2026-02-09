"use client";
import { createAccount } from "@/app/apiHandlers/account";
import AccountForm from "@/app/forms/AccountForm";

export default function CreateAccount(){

  const submit = async (data) => {
    try {
      await createAccount(data);
    } catch (err) {
      return err;
    }
  };
  
  return (
    <AccountForm onSubmit={submit}/>
  )
}