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
import { getServices } from "../api/services";

export default function BundleForm({ onSubmit }) {
  const router = useRouter();
  const [services, setServices] = useState(null);

  useEffect(()=> {
    const fetch = async () => {
      const data = await getServices();
      setServices(data);
    };

    fetch();

  },[]);
  
  const methods = useForm();
  const submit = methods.handleSubmit(async (data) => {
      await onSubmit(data, services);
      
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
            <Input {...priceValidation} />
          </div>
          <div className={styles.soloRow}>
            <label className={styles.fieldsTitle}>Servicios</label>
            <div className={styles.servicesContainer}>
              {services&&(services.map((service) => {
                service.id = service.name;
                return (<ServiceCheckbox
                  key={service.name}
                  id={"services"}
                  service={service}
                ></ServiceCheckbox>)
              }))}
            </div>
          </div>

          <div className={styles.soloRow}>
            <TextArea {...descriptionValidation} />
          </div>
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
            <button>Agendar cita</button>
          </div>
        </div>
      </form>
    </FormProvider>
  );
}
