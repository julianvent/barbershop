import { useFormContext } from "react-hook-form";
import styles from "./Time-Selector.module.css";
import TimeRadio from "../radio/TimeRadio";

export default function TimeSelector({ times, id, validation }) {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <fieldset {...register(id, validation)} className={styles.timeContainer}>
      <span className={styles.fieldsTitle}>Hora programada</span>
      <div className={styles.times}>
        {times.map((time) => (
          <TimeRadio key={time.id} time={time} id={id}></TimeRadio>
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
