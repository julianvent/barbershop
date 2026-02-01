"use client";
import { establishmentRoute } from "@/app/utils/routes";
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import styles from "./EmployeeFormStyles.module.css";
import Input from "@/app/components/form/input/Input";
import { cityValidation, stateValidation, externalNoValidation, internalNoValidation, nameValidation, phoneValidation, photoValidation, postalCodeValidation, streetValidation } from "@/app/utils/establishmentValidators";

export default function EstablishmentForm ({onSubmit, establishment}) {
  const router = useRouter();
  const methods = useForm({
    defaultValues: establishment || {}
  })

  const { handleSubmit, watch, setValue, formState: { errors } } = methods;
  const [preview, setPreview] = useState(null);
  const [isCreatingEstablishment, setIsCreatingEstablishment] = useState(false);
  const file = watch("image");
  const submit = methods.handleSubmit ( async (data) => {
    setIsCreatingEstablishment(true);
    console.log(data)

    let err;
    if(establishment){
      err = await onSubmit(establishment.id, data)
    } else {
      err = await onSubmit(data);
    }
    if (err) {
      methods.setError("root.serverError", {
        type:"server",
        message: err
      })
      setIsCreatingEstablishment(false)
    } else {
      setIsCreatingEstablishment(false)
      router.push(establishmentRoute)
    }
  })


  useEffect(() => {
    if(establishment){
      methods.reset({
        ...establishment
      })
    }
  },[establishment, methods])

  useEffect(() => {
    if (file && file.length > 0) {
        const selectedFile = file[0];
        const allowedTypes = ["image/jpeg", "image/png"];
        if (allowedTypes.includes(selectedFile.type)) {
            const reader = new FileReader();
            reader.onloadend = () => setPreview(reader.result);
            reader.readAsDataURL(selectedFile);
        } else {
            setPreview(null);
        }
    } else {
    setPreview(null);
    }
}, [file, setValue]);
  
  return (
    <div>
      <FormProvider {...methods}>
        <form encType="multipart/form-data" onSubmit={(e) => {
          e.preventDefault();
          submit()
        }}>
          <article className={styles.fieldsContainer}>
            <div className={styles.columns}>

              <figure className={styles.imageContainer}>
                <img
                    src={establishment && !preview ? establishment.image_path : (preview ? preview : '/image.svg')}
                    alt="Previsualizacion de la imagen del empleado"
                    className={(preview || establishment) ? styles.imageFitBack :  styles.imageFit}
                />
                <figcaption>{!establishment ? 'Vista Previa del Establecimiento':'Imagen del establecimiento'}</figcaption>
              </figure>

              <article className={styles.subFields}>
                
                <div className={styles.row}>
                  <Input {...nameValidation}/>
                  <Input {...phoneValidation}/>
                </div>


                <div className={styles.row}>
                  <Input {...stateValidation}/>
                  <Input {...cityValidation}/>
                  <Input {...streetValidation}/>
                </div>

                <div className={styles.row}>
                  <Input {...postalCodeValidation}/>
                  <Input {...externalNoValidation}/>
                  <Input {...internalNoValidation}/>
                </div>

                <div className={styles.row}>
                  <Input {...photoValidation(!!establishment?.image_path)}/>
                </div>



                <div className={styles.row}>
                  {methods.formState.errors.root?.serverError && (
                    <div className={styles.errorMessage}>
                      {methods.formState.errors.root.serverError.message}
                    </div>
                  )}
                </div>


              </article>

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

          </article>

        </form>
      </FormProvider>
    </div>
  )
}