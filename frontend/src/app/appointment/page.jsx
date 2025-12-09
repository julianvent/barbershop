import AppointmentForm from "@/app/admin/appointments/AppointmentForm/AppointmentForm";

import styles from "./New-Appointment-Customer.module.css";
import CustomerHeader from "../components/customer_header/CustomerHeader";

export default function NewAppointmentCustomer() {
  return (
    <div className={styles.layout}>
      <title>SG Barbershop - Agendar Cita</title>
      <CustomerHeader title={"Agendar cita"}></CustomerHeader>
      <main className={styles.scrollableContent}>
        <AppointmentForm mode={"customer"}></AppointmentForm>
      </main>
    </div>
  );
}
