import { useFormContext } from "react-hook-form";
import styles from "./Service-Selector.module.css";
import ServiceCheckbox from "../checkbox/ServiceCheckbox";

export default function ServiceSelector({ services, id, validation }) {
  const {
    register,
    formState: { errors },
  } = useFormContext();
  return (
    <fieldset
      {...register(id, validation)}
      className={styles.servicesContainer}
    >
      <span className={styles.fieldsTitle}>Servicios</span>
      <div className={styles.services}>
        {services.map((service) => (
          <ServiceCheckbox
            key={service.id}
            service={service}
            id={id}
          ></ServiceCheckbox>
        ))}
      </div>
      {errors[id] && (
        <p className={`error`} role="alert">
          {errors[id].message}
        </p>
      )}
    </fieldset>
  );
}
