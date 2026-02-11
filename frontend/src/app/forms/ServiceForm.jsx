import { useForm, FormProvider } from "react-hook-form";
import styles from "./styles.module.css";
import Input from "../components/form/input/Input";
import {
  durationValidation,
  nameValidation,
  priceValidation,
  descriptionValidation,
  typeValidation,
} from "@/app/utils/servicesValidators";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import TextArea from "@/app/components/form/input/TextArea";
import { servicesRoute } from "@/app/utils/routes";
import StatusSelect from "@/app/components/form/input/StatusSelect";
import { statusValidation } from "@/app/utils/servicesValidators";
import InputDecimal from "@/app/components/form/input/InputDecimal";

export default function ServiceForm({ onSubmit, service, isAdmin }) {
  const router = useRouter();
  const [isCreatingService, setIsCreatingService] = useState(false);
  const methods = useForm({
    defaultValues: service || {},
  });

  const submit = methods.handleSubmit(async (data) => {
    setIsCreatingService(true);

    const err = await onSubmit(data);
    

      if (err) {

        methods.setError("root.serverError", {
          type: "server",
          message: err,
        });
      }else{
        router.push(servicesRoute);
      }
      setIsCreatingService(false);
  });

  useEffect(() => {
    if (service) {
      methods.reset(service);
    }
  }, [service, methods]);

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
      >
        <div className={styles.fieldsContainer}>
          <div className={styles.row}>
            <Input {...nameValidation} disabled={service}></Input>
            <InputDecimal {...priceValidation}></InputDecimal>
          </div>

          <div className={styles.row}>
            <Input {...durationValidation}></Input>
            {service ?(<Input {...typeValidation} disabled={service.type == 'Paquete'}></Input>):(<Input {...typeValidation}></Input>)}
            {service && <StatusSelect {...statusValidation} />}
          </div>

          <div className={styles.soloRow}>
          {(!service || service.type !== "Paquete") && (
            <TextArea {...descriptionValidation} />
          )}
            {methods.formState.errors.root?.serverError && (
              <div className={styles.errorMessage}>
                {methods.formState.errors.root.serverError.message}
              </div>
            )}
          </div>

          <div className={styles.fieldsConta}>
            <div className={styles.buttons}>
              <button
                  className={styles.cancelButton}
                  onClick={(e) => {
                      e.preventDefault();
                      router.push(servicesRoute);
                  }}>
                  Cancelar
              </button>
              <button type="submit" disabled={isCreatingService}>Confirmar</button>
            </div>
          </div>
        </div>
      </form>
    </FormProvider>
  );
}
