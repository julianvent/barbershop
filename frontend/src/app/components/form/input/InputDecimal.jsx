import { useFormContext } from "react-hook-form";
import styles from "./Input.module.css";

const InputDecimal = ({
  label,
  type,
  id,
  placeholder,
  validation,
  autoComplete,
  defaultValue,
  disabled,
}) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <div className={styles.field}>
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        autoComplete={autoComplete}
        defaultValue={defaultValue}
        disabled={disabled}
        {...register(id, validation)}
        step={'0.01'}
      />
      {errors[id] && <span role="alert">{errors[id].message}</span>}
    </div>
  );
};

export default InputDecimal;
