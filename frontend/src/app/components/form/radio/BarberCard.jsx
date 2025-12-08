import { useFormContext } from "react-hook-form";
import styles from "./Barber-Card.module.css";

export default function BarberCard({ id, barber, validation }) {
  const { register } = useFormContext();
  return (
    <div className={styles.card}>
      <div className={styles.photoContainer}>
        <img src={barber.image_path} alt={`${barber.barber_name} photo`} />
      </div>
      <div className={styles.radioContainer}>
        <input
          id={'barbero-'+barber.id}
          type="radio"
          value={barber.id}
          {...register(id, { ...validation })}
        />
        <label htmlFor={'barbero-'+barber.id}>
          <p>{barber.barber_name}</p>
        </label>
      </div>
    </div>
  );
}
