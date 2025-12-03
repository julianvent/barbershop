import { useFormContext } from "react-hook-form";
import styles from "./Barber-Card.module.css";

export default function BarberCard({ id, barber, onChange, validation }) {
  const { register } = useFormContext();
  return (
    <div className={styles.card}>
      <div className={styles.photoContainer}>
        <img src={barber.photo} alt={`${barber.name} photo`} />
      </div>
      <div className={styles.radioContainer}>
        <input
          type="radio"
          value={barber.id}
          {...register(id, { ...validation, onChange: onChange })}
        />
        <label>
          <p>{barber.barber_name}</p>
        </label>
      </div>
    </div>
  );
}
