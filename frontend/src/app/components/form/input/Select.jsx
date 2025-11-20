"use client";

import { useFormContext } from "react-hook-form";
import styles from "./Input.module.css";

const Select = ({ id, label, options, disabled, onChange }) => {
  const { register } = useFormContext();

  return (
    <div className={styles.field}>
      <label htmlFor={id}>{label}</label>
      <select
        id={id}
        disabled={disabled}
        {...register(id, { onChange: onChange })}
      >
        {options.map((value) => {
          return (
            <option key={value.id} value={value.value}>
              {value.name}
            </option>
          );
        })}
      </select>
    </div>
  );
};

export default Select;
