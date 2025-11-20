import { useFormContext } from "react-hook-form";
import styles from "./Service-Checkbox.module.css";

export default function ServiceCheckbox({ service, onChange, id }) {
  const { register } = useFormContext();
  return (
    <div className={styles.checkbox}>
      <input
        type="checkbox"
        value={service.id}
        {...register(id, {
          onChange: onChange,
        })}
      />
      <label>{service.name}</label>
    </div>
  );
}
