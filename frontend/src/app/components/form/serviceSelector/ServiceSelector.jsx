import { useFormContext } from "react-hook-form";
import styles from "./Service-Selector.module.css";
import ServiceCheckbox from "../checkbox/ServiceCheckbox";

export default function ServiceSelector({ services, id, validation }) {
  const {
    formState: { errors },
  } = useFormContext();
  return (
    <fieldset className={styles.servicesContainer}>
      <span>
        <strong>Servicios</strong>
      </span>
      {services.length === 0 ? (
        <p>No se encontraron servicios.</p>
      ) : (
        <div className={styles.services}>
          {services.map((service) => (
            <ServiceCheckbox
              key={service.id}
              service={service}
              id={id}
              validation={validation}
            ></ServiceCheckbox>
          ))}
        </div>
      )}
      {errors[id] && (
        <p className={`error`} role="alert">
          {errors[id].message}
        </p>
      )}
    </fieldset>
  );
}
