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
import { appointmentsRoute } from "@/app/utils/routes";

export default function SignInForm() {
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [error, setError] = useState("");
  const methods = useForm();
  const router = useRouter();

  const onSubmit = methods.handleSubmit(
    async (data) => {
      setIsSigningIn(true);
      setError("");
      methods.clearErrors();

      try {
        await signIn(data);
        router.push(appointmentsRoute);
      } catch (error) {
        setError("Algo salió mal. Intenta de nuevo...");
      } finally {
        setIsSigningIn(false);
      }
    },
    (errors) => {
      const firstKey = Object.keys(errors || {})[0];
      if (firstKey) methods.setFocus(firstKey);
    }
  );

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
        noValidate
        aria-busy={isSigningIn}
      >
        <div className={styles.fieldsContainer}>
          <Input {...emailValidation}></Input>
          <Input {...passwordValidation}></Input>
          <button
            type="submit"
            disabled={isSigningIn}
            aria-disabled={isSigningIn}
          >
            {isSigningIn ? "Iniciando sesión..." : "Iniciar sesión"}
          </button>
          {error && (
            <div className={styles.error}>
              <figure>
                <img
                  src="/icons/circle-exclamation-solid-full.svg"
                  alt="Error image"
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
