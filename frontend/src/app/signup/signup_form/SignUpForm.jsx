import { useRouter } from "next/navigation";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import styles from "./Sign-Up-Form.module.css";
import Input from "@/app/components/form/input/Input";
import * as validators from "@/app/utils/inputValidators";
import { signUp } from "../api/signUp";
import ConfirmPasswordInput from "@/app/components/form/input/ConfirmPasswordInput";

export default function SignUpForm() {
  const [isSigningUp, setIsSigningUp] = useState();
  const router = useRouter();
  const methods = useForm();

  const onSubmit = methods.handleSubmit(async (data) => {
    setIsSigningUp(true);
    await signUp(data);
    router.push("/signin");
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
          <button type="submit" disabled={isSigningUp}>
            Crear cuenta
          </button>
        </div>
      </form>
    </FormProvider>
  );
}
