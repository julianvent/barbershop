import { useFormContext } from "react-hook-form";
import styles from "./Time-Selector.module.css";
import TimeRadio from "../radio/TimeRadio";

export default function TimeSelector({ times, id, validation, label }) {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <fieldset
      {...register(id, { ...validation })}
      className={styles.timeContainer}
    >
      <span>
        <strong>{label}</strong>
      </span>
      {times.length === 0 ? (
        <p>No se encontraron horarios disponibles.</p>
      ) : (
        <div className={styles.times}>
          {times.map((time) => (
            <TimeRadio key={time} time={time} id={id}></TimeRadio>
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
