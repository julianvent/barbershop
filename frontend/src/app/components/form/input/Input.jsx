import { useFormContext } from "react-hook-form";
import styles from "./Input.module.css";

const Input = ({
  label,
  type,
  id,
  placeholder,
  validation,
  autoComplete,
  defaultValue,
  disabled,
  onChange,
  minDate,
}) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const errorId = `${id}-error`;

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
        aria-invalid={!!errors[id]}
        aria-describedby={errors[id] ? errorId : undefined}
        min={minDate}
        {...register(id, { ...validation, onChange: onChange })}
      />
      {errors[id] && (
        <span id={errorId} role="alert" aria-live="assertive">
          {errors[id].message}
        </span>
      )}
    </div>
  );
};

export default Input;
