import AppointmentForm from "@/app/dashboard/appointments/AppointmentForm/AppointmentForm";

import styles from "./New-Appointment-Customer.module.css";

export default function NewAppointmentCustomer() {
  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <h1>Reservar cita</h1>
        <figure>
          <img src="icons/Sagoz_Icon.png" alt="Sagoz Logo" />
        </figure>
      </header>
      <main className={styles.scrollableContent}>
        <AppointmentForm mode={"customer"}></AppointmentForm>
      </main>
    </div>
  );
}
