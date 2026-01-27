import { FormProvider, useForm } from "react-hook-form";
import styles from "./styles.module.css";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Input from "@/app/components/form/input/Input";
import {
  descriptionValidation,
  nameValidation,
  priceValidation,
} from "@/app/utils/bundlesValidators";
import TextArea from "@/app/components/form/input/TextArea";
import ServiceCheckbox from "@/app/components/form/checkbox/ServiceCheckbox";
import { servicesRoute } from "@/app/utils/routes";
import { getServices } from "@/app/apiHandlers/adminServices";
import InputDecimal from "@/app/components/form/input/InputDecimal";

export default function BundleForm({ onSubmit }) {
  const router = useRouter();
  const [services, setServices] = useState(null);
  const [isCreatingBundle, setIsCreatingBundle] = useState(false);

  useEffect(()=> {
    const fetch = async () => {
      const data = await getServices();
      const onlyServices = data.filter((e) => e.type != 'Paquete');
      setServices(onlyServices);
    };

    fetch();

  },[]);
  
  const methods = useForm();
  const submit = methods.handleSubmit(async (data) => {
      setIsCreatingBundle(true);
      
      const err = await onSubmit(data, services);

      if(err){
        methods.setError("root.serverError", {
          type: "server",
          message: err,
        });
        setIsCreatingBundle(false);
      }else{
        router.push(servicesRoute);
      }
      
  });

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
            <Input {...nameValidation} />
            <InputDecimal {...priceValidation} />
          </div>
          <div className={styles.soloRow}>
            <fieldset id="services_container" className={styles.servicesContainer}>
              <legend>Servicios</legend>
              {services&&(services.map((service) => {
                service.id = service.name;
                return (<ServiceCheckbox
                  key={service.name}
                  id={"services"}
                  service={service}
                ></ServiceCheckbox>)
              }))}
            </fieldset>
          </div>

          <div className={styles.soloRow}>
            <TextArea {...descriptionValidation} />
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
                }}
              >
                Cancelar
              </button>
              <button>Confirmar</button>
            </div>
          </div>
        </div>
      </form>
    </FormProvider>
  );
}
