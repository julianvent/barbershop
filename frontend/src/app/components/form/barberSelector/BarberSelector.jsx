import { useFormContext } from "react-hook-form";
import BarberCard from "../radio/BarberCard";
import styles from "./Barber-Selector.module.css";

export default function BarberSelector({ barbers, id, validation }) {
  const {
    formState: { errors },
  } = useFormContext();

  return (
    <fieldset className={styles.fieldsetContainer}>
      <legend><h2>Selecciona un barbero</h2></legend>
      <div className={styles.barbers}>
        {barbers.length === 0 ? (
          <p>No se encontraron barberos.</p>
        ) : (
          barbers.map((barber) => (
            <BarberCard
              key={barber.id}
              barber={barber}
              id={id}
              validation={validation}
            ></BarberCard>
          ))
        )}
      </div>
      {errors[id] && (
        <span className={`error`} role="alert">
          {errors[id].message}
        </span>
      )}
    </fieldset>
  );
}
