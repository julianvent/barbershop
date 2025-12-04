import { useFormContext } from "react-hook-form";
import BarberCard from "../radio/BarberCard";
import styles from "./Barber-Selector.module.css";

export default function BarberSelector({ barbers, id, onChange, validation }) {
  const {
    formState: { errors },
  } = useFormContext();

  return (
    <fieldset className={styles.fieldsetContainer}>
      <div className={styles.barbers}>
        {barbers.map((barber) => (
          <BarberCard
            key={barber.id}
            barber={barber}
            onChange={onChange}
            id={id}
            validation={validation}
          ></BarberCard>
        ))}
      </div>
      {errors[id] && (
        <span className={`error`} role="alert">
          {errors[id].message}
        </span>
      )}
    </fieldset>
  );
}
