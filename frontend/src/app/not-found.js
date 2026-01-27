import Link from "next/link";
import { appointmentsRoute, makeAppointmentRoute } from "./utils/routes";
import styles from "./not-found.module.css";

export default function NotFound() {
  return (
    <div className={styles.notFoundLayout}>
      <title>SGBarbershop</title>
      <figure>
        <img src="/Sagoz_Logo.png" alt="Sagoz Logo" />
      </figure>
      <h1>Página no encontrada</h1>
      <Link href={appointmentsRoute}>Volver al panel</Link>
      <Link href={makeAppointmentRoute}>Agenda una cita</Link>
    </div>
  );
}
