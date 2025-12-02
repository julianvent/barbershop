import { useFormContext } from "react-hook-form";
import BarberCard from "../radio/BarberCard";
import styles from "./Barber-Selector.module.css";

export default function BarberSelector({ barbers, id, validation, onChange }) {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <fieldset
      {...register(id, validation)}
      className={styles.fieldsetContainer}

    >
      <div className={styles.barbers}>
        {barbers.map((barber) => (
          <BarberCard
            key={barber.id}
            barber={barber}
            onChange={onChange}
            id={id}
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
