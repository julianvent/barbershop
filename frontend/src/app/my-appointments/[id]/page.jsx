"use client";
import AppointmentDetail from "@/app/dashboard/appointments/AppointmentDetail/AppointmentDetail";
import { appointmentAuthQueryParam } from "@/app/utils/appointmentValidators";
import { useParams, useSearchParams } from "next/navigation";
import styles from "./Appointment-Detail-Customer.module.css";

export default function AppointmentDetailCustomer() {
  const { id } = useParams();
  const queryParams = useSearchParams();
  const auth = queryParams.get(appointmentAuthQueryParam);

  return (
    <div className={styles.layout}>
      <h1>Reservar cita</h1>
      <main className={styles.scrollableContent}>
        <AppointmentDetail appointmentId={id} auth={auth}></AppointmentDetail>
      </main>
    </div>
  );
}
