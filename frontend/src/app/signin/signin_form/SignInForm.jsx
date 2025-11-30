"use client";

import styles from "./Sign-Form.module.css";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import Input from "@/app/components/form/input/Input";
import {
  emailValidation,
  passwordValidation,
} from "@/app/utils/inputValidators";
import { signIn } from "../api/signIn";
import { useRouter } from "next/navigation";

export default function SignInForm() {
  const [isSigningIn, setIsSigningIn] = useState(false);
  const methods = useForm();
  const router = useRouter();

  const onSubmit = methods.handleSubmit(async (data) => {
    setIsSigningIn(true);
    try{
      await signIn(data, router);
    }finally{
      setIsSigningIn(false);
    }
  });

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
        noValidate
      >
        <div className={styles.fieldsContainer}>
          <Input {...emailValidation}></Input>
          <Input {...passwordValidation}></Input>
          <button type="submit" disabled={isSigningIn}>
            Iniciar sesión
          </button>
        </div>
      </form>
    </FormProvider>
  );
}
