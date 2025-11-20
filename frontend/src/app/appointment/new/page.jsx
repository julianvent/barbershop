import AppointmentForm from "@/app/dashboard/appointments/AppointmentForm/AppointmentForm";

import styles from "./New-Appointment-Customer.module.css";

export default function NewAppointmentCustomer() {
  return (
    <div className={styles.layout}>
      <h1>Reservar cita</h1>
      <main className={styles.scrollableContent}>
        <AppointmentForm mode={"customer"}></AppointmentForm>
      </main>
    </div>
  );
}
