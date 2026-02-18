'use client';
import { FormProvider, useForm } from "react-hook-form";
import styles from "./EmployeeFormStyles.module.css"
import Input from "@/app/components/form/input/Input";
import { emailValidation, establishmentValidation, nameValidation, phoneValidation, photoValidation, statusValidation } from "@/app/utils/employeesValidators";
import { useEffect, useState } from "react";
import { staffRoute } from "@/app/utils/routes";
import { useRouter } from "next/navigation";
import StatusSelect from "@/app/components/form/input/StatusSelect";
import Select from "../components/form/input/Select";
import { getEstablishments } from "../apiHandlers/adminEstablishments";


export default function EmployeeForm({onSubmit,employee, isAdmin}){
    const router = useRouter();
    const methods = useForm({
        defaultValues: employee || {}
    });
    const establishments = useEstablishment();

  function useEstablishment() {
  const [establishment, setEstablishment] = useState([]);

  useEffect(() => {
    async function fetchEstablishments() {
      try {
        const data = await getEstablishments();
        const es =data.map((e) => {
          return {
            id: e.id,
            value: e.id,
            name: e.name
          }
        })
        const locals = [
          {
            id: "",
            value: "",
            name: "Selecciona un establecimiento"
          },
          ...es]
        setEstablishment(locals);
      } catch (error) {
        return establishment;
      }
    }
    fetchEstablishments();
  }, []);
  return establishment;  
  }

    const { handleSubmit, watch, setValue, formState: { errors } } = methods;
    const [preview, setPreview] = useState(null);
    const [isCreatingEmployee, setIsCreatingEmployee] = useState(false);
    const file = watch("image");
    const submit = methods.handleSubmit( async function(data){
        setIsCreatingEmployee(true);
        const err = await onSubmit(data);

        if(err){
            methods.setError("root.serverError", {
            type: "server",
            message: err,
            });
        }else{
            router.push(staffRoute);
        }
        
        setIsCreatingEmployee(false);

        
    });

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

    useEffect(() => {
        if (employee) {
        methods.reset({
            ...employee,
            is_active: employee.is_active ? "active" : "inactive"
        });
        }
    }, [employee, methods]);


    return (
        <FormProvider {...methods}>
            <form onSubmit={(e) => {
                e.preventDefault();
                submit();

            }}>
                
                <article className={styles.fieldsContainer}>
                    <div className={styles.columns}>
                        <figure className={styles.imageContainer}>
                            <img
                                src={employee && !preview ? employee.image_path : (preview ? preview : '/image.svg')}
                                alt="Previsualizacion de la imagen del empleado"
                                className={(preview || employee) ? styles.imageFitBack :  styles.imageFit}
                            />
                            <figcaption>{!employee ? 'Vista Previa de la Imagen':'Imagen del empleado'}</figcaption>
                        </figure>
                        
                        <article className={styles.subFields}>
                            <div className={styles.row}>
                                <Input {...nameValidation}></Input>
                                {employee&&(<StatusSelect {...statusValidation}/>)}
                            </div>
                            <div className={styles.row}>
                                <Input {...phoneValidation}/>
                                <Input {...emailValidation}/>
                            </div>

                            <div className={styles.row}>
                                    <Input {...photoValidation(!!employee?.image_path)}/>
                            </div>
                            {
                                isAdmin&&(
                                    <div className={styles.row}>
                                    <Select options={establishments} {...establishmentValidation}/>
                                    </div>
                                    )
                            }
                            {methods.formState.errors.root?.serverError && (
                                <div className={styles.errorMessage}>
                                    {methods.formState.errors.root.serverError.message}
                                </div>
                            )}
                        </article>
                    </div>
                    <div className={styles.fieldsConta}>

                        <div className={styles.buttons}>
                            <button
                                className={styles.cancelButton}
                                onClick={(e) => {
                                    e.preventDefault();
                                    router.push(staffRoute);
                                }}>
                                Cancelar
                            </button>
                            <button type="submit" disabled={isCreatingEmployee}>Confirmar</button>
                        </div>
                    </div>
                </article>
                

            </form>
        </FormProvider>
    )
}