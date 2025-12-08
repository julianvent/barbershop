import AppointmentForm from "@/app/dashboard/appointments/AppointmentForm/AppointmentForm";

import styles from "./New-Appointment-Customer.module.css";
import CustomerHeader from "../components/customer_header/CustomerHeader";

export default function NewAppointmentCustomer() {
  return (
    <div className={styles.layout}>
      <CustomerHeader title={"Agendar cita"}></CustomerHeader>
      <main className={styles.scrollableContent}>
        <AppointmentForm mode={"customer"}></AppointmentForm>
      </main>
    </div>
  );
}
