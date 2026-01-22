"use client";
import { establishmentRoute } from "@/app/utils/routes";
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import styles from "./styles.module.css";
import Input from "@/app/components/form/input/Input";
import { cityValidation, colonyValidation, externalNoValidation, internalNoValidation, nameValidation, phoneValidation, postalCodeValidation, streetValidation } from "@/app/utils/establishmentValidators";

export default function EstablishmentForm ({onSubmit, establishment}) {
  const router = useRouter();
  const methods = useForm({
    defaultValues: establishment || {}
  })

  const [isCreatingEstablishment, setIsCreatingEstablishment] = useState(false);
  const submit = methods.handleSubmit ( async (data) => {
    setIsCreatingEstablishment(true);
    const err = await onSubmit(data);

    if (err) {
      methods.setError("root.serverError", {
        type:"server",
        message: err
      })
      setIsCreatingEstablishment(false)
    } else {
      setIsCreatingEstablishment(false)
      // router.push(establishmentRoute)
    }
  })


  useEffect(() => {
    if(establishment){
      methods.reset({
        ...establishment
      })
    }
  },[establishment, methods])
  
  return (
    <div>
      <FormProvider {...methods}>
        <form onSubmit={(e) => {
          e.preventDefault();
          submit()
        }}>
          <div className={styles.fieldsContainer}>
            <div className={styles.row}>
              <Input {...nameValidation}/>
              <Input {...phoneValidation}/>
            </div>


            <div className={styles.row}>
              <Input {...cityValidation}/>
              <Input {...colonyValidation}/>
            </div>

            <div className={styles.row}>
              <Input {...streetValidation}/>
              <Input {...postalCodeValidation}/>
            </div>
            
            <div className={styles.row}>
              <Input {...externalNoValidation}/>
              <Input {...internalNoValidation}/>
            </div>


            <div className={styles.row}>
              {methods.formState.errors.root?.serverError && (
                <div className={styles.errorMessage}>
                  {methods.formState.errors.root.serverError.message}
                </div>
              )}
            </div>

            <div className={styles.fieldsConta}>
              <div className={styles.buttons}>
                <button className={styles.cancelButton} onClick={(e) => {
                  e.preventDefault()
                  router.push(establishmentRoute)
                }}>Regresar</button>

                <button type="submit" disabled={isCreatingEstablishment}>Confirmar</button>
              </div>
              
            </div>

            
          </div>

        </form>
      </FormProvider>
    </div>
  )
}