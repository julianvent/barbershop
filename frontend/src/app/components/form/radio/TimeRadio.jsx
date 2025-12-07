import { useFormContext } from "react-hook-form";
import styles from "./Time-Radio.module.css";

export default function TimeRadio({ id, time, validation }) {
  const { register } = useFormContext();

  return (
    <div className={styles.timeRadioContainer}>
      <input
        type="radio"
        value={`${time}`}
        {...register(id, { ...validation })}
      />
      <label>{`${time}`}</label>
    </div>
  );
}
