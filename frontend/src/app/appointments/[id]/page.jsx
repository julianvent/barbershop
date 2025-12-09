"use client";
import AppointmentDetail from "@/app/admin/appointments/AppointmentDetail/AppointmentDetail";
import { appointmentAuthQueryParam } from "@/app/utils/appointmentValidators";
import { useParams, useSearchParams } from "next/navigation";
import styles from "./Appointment-Detail-Customer.module.css";
import CustomerHeader from "../../components/customer_header/CustomerHeader";

export default function AppointmentDetailCustomer() {
  const { id } = useParams();
  const queryParams = useSearchParams();
  const auth = queryParams.get(appointmentAuthQueryParam);

  return (
    <div className={styles.layout}>
      <title>SG Barbershop - Detalle Cita</title>
      <CustomerHeader title={"Detalle de cita"}></CustomerHeader>
      <main className={styles.scrollableContent}>
        <AppointmentDetail
          appointmentId={id}
          auth={auth}
          customerMode={true}
        ></AppointmentDetail>
      </main>
    </div>
  );
}
