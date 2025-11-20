import { useForm, FormProvider } from "react-hook-form";
import styles from "./styles.module.css";
import Input from "../../../components/form/input/Input";
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

export default function ServiceForm({ onSubmit, service }) {
  const router = useRouter();
  const [isCreatingBundle, setIsCreatingBundle] = useState(false);
  const methods = useForm({
    defaultValues: service || {},
  });

  const submit = methods.handleSubmit(async (data) => {
    setIsCreatingBundle(true);
    if (service) {
      await onSubmit(data, service.id);
    } else {
      await onSubmit(data);
    }
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
            <Input {...nameValidation}></Input>
            <Input {...priceValidation}></Input>
          </div>

          <div className={styles.row}>
            <Input {...durationValidation}></Input>
            <Input {...typeValidation}></Input>
            {service && <StatusSelect {...statusValidation} />}
          </div>

          <div className={styles.soloRow}>
            <TextArea {...descriptionValidation}></TextArea>
          </div>

          <div className={styles.fieldsConta}>
            <div className={styles.buttons}>
              <button type="submit">Confirmar</button>
            </div>
          </div>
        </div>
      </form>
    </FormProvider>
  );
}
