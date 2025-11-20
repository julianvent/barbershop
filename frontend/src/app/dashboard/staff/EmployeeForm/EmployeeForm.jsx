'use client';
import { FormProvider, useForm } from "react-hook-form";
import styles from "./styles.module.css"
import Input from "@/app/components/form/input/Input";
import { emailValidation, lastNameValidation, nameValidation, phoneValidation, photoValidation, statusValidation } from "@/app/utils/employeesValidators";
import { useEffect, useState } from "react";
import { staffRoute } from "@/app/utils/routes";
import { useRouter } from "next/navigation";
import StatusSelect from "@/app/components/form/input/StatusSelect";


export default function EmployeeForm({onSubmit,employee}){
    const router = useRouter();
    const methods = useForm({
        defaultValues: employee || {}
    });

    const { handleSubmit, watch, setValue, formState: { errors } } = methods;
    const [preview, setPreview] = useState(null);
    const file = watch("photo");
    const submit = methods.handleSubmit( async function(data){
        if(employee){
            onSubmit(employee.id, data);
        }else{
            onSubmit(data);
        }
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
        methods.reset(employee);
        }
    }, [employee, methods]);


    return (
        <FormProvider {...methods}>
            <form onSubmit={(e) => {
                e.preventDefault();
                submit();

            }}>
                
                <div className={styles.fieldsContainer}>
                    <div className={styles.columns}>
                    <div className={styles.imageContainer}>
                        <img
                            src={employee && !preview ? employee.photo :(preview ? preview : '/image.svg')}
                            alt="Imagen del personal"
                            className={(preview || employee) ? styles.imageFitBack :  styles.imageFit}
                        />
                    </div>
                        
                    <div className={styles.subFields}>
                        <div className={styles.row}>
                            <Input {...nameValidation}></Input>
                            <Input {...lastNameValidation}/>
                        </div>
                        <div className={styles.row}>
                            <Input {...phoneValidation}/>
                            <Input {...emailValidation}/>
                        </div>
                        <div className={styles.row}>
                            {employee&&(<StatusSelect {...statusValidation}/>)}
                        </div>

                    </div>
                </div>
                <div className={styles.columns}>
                    <div>
                        <Input {...photoValidation}/>
                    </div>
                </div>
                    <div className={styles.buttons}>
                        <button
                            className={styles.cancelButton}
                            onClick={(e) => {
                                e.preventDefault();
                                router.push(staffRoute);
                            }}>
                            Cancelar
                        </button>
                        <button type="submit">Confirmar</button>
                    </div>
                </div>
                

            </form>
        </FormProvider>
    )
}