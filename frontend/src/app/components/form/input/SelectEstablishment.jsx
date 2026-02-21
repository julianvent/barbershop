"use client";

import { useFormContext } from "react-hook-form";
import styles from "./Input.module.css";

const SelectEstablishment = ({ id, label, options, disabled, onChange, validation }) => {
  const { register, formState: {errors} } = useFormContext();
  const errorId = `${id}-error`;


  return (
    <div className={styles.field}>
      <label htmlFor={id}>{label}</label>
      <select
        id={id}
        disabled={disabled}
        {...register(id, { ...validation, onChange: onChange })}
      >
        {options.map((value) => {
          return (
            <option key={value.id} value={value.value}>
              {value.name}
            </option>
          );
        })}
      </select>
      {errors[id] && (
        <span id={errorId} role="alert" aria-live="assertive">
          {errors[id].message}
        </span>
      )}
    </div>
  );
};

export default SelectEstablishment;
