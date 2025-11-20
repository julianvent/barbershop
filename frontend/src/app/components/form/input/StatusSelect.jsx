import { useFormContext } from "react-hook-form";
import styles from "./Input.module.css";

const StatusSelect = ({ label, id, validation }) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <div className={styles.field}>
      <label htmlFor={id}>{label}</label>
      <select id={id} {...register(id, validation)}>
        <option value="active">Activo</option>
        <option value="inactive">Inactivo</option>
      </select>
      {errors[id] && <span role="alert">{errors[id].message}</span>}
    </div>
  );
};

export default StatusSelect;
