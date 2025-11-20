import { FormProvider, useForm } from "react-hook-form";
import styles from "./styles.module.css";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Input from "@/app/components/form/input/Input";
import {
  descriptionValidation,
  nameValidation,
  priceValidation,
} from "@/app/utils/bundlesValidators";
import TextArea from "@/app/components/form/input/TextArea";
import ServiceCheckbox from "@/app/components/form/checkbox/ServiceCheckbox";
import { servicesEntries } from "@/app/utils/data";
import { servicesRoute } from "@/app/utils/routes";

export default function BundleForm({ onSubmit }) {
  const router = useRouter();
  const [isCreatingService, setIsCreatingService] = useState(false);
  const methods = useForm();
  const submit = methods.handleSubmit(async (data) => {
    setIsCreatingService(true);
    await onSubmit(data);
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
              {servicesEntries.map((service) => (
                <ServiceCheckbox
                  key={service.id}
                  id={"services"}
                  service={service}
                ></ServiceCheckbox>
              ))}
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
