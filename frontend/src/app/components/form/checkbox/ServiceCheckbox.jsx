import { useFormContext } from "react-hook-form";
import styles from "./Service-Checkbox.module.css";

export default function ServiceCheckbox({ service, id, validation }) {
  const { register } = useFormContext();
  const inputId = `${id}-${service.id}`;

  return (
    <div className={styles.checkbox}>
      <input
        id={inputId}
        type="checkbox"
        value={String(service.id)}
        {...register(id, validation)}
      />
      <label htmlFor={inputId}>{service.name}</label>
    </div>
  );
}
