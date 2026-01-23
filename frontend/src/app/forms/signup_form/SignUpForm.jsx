"use client";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import styles from "./Sign-Up-Form.module.css";
import Input from "@/app/components/form/input/Input";
import * as validators from "@/app/utils/inputValidators";
import { signUp } from "../../signup/api/signUp";
import ConfirmPasswordInput from "@/app/components/form/input/ConfirmPasswordInput";
import { useRouter } from "next/navigation";

export default function SignUpForm() {
  const [signingUp, setSigningUp] = useState();
  const [error, setError] = useState("");
  const methods = useForm();
  const router = useRouter();

  const onSubmit = methods.handleSubmit(async (data) => {
    setIsSigningUp(true);
    try{
      await signUp(data);
    }finally{
      setIsSigningUp(false);
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
          <Input {...validators.nameValidation}></Input>
          <Input {...validators.emailValidation}></Input>
          {/* HACK: used autoComplete new-password to disable autofill, not sure if best practice */}
          <Input
            {...validators.passwordValidation}
            autoComplete={"new-password"}
          ></Input>
          <ConfirmPasswordInput></ConfirmPasswordInput>
          <button type="submit" disabled={signingUp}>
            Crear cuenta
          </button>
          {error && (
            <div className={styles.error}>
              <figure>
                <img
                  src="/icons/circle-exclamation-solid-full.svg"
                  alt="Error"
                />
              </figure>
              <p>{error}</p>
            </div>
          )}
        </div>
      </form>
    </FormProvider>
  );
}
