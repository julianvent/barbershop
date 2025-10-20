import styles from "./Appointment.module.css";
import AppointmentTable from "./appointment_table/AppointmentTable";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Appointment() {
  const [appointments, setAppoinments] = useState([]);

  useEffect(() => {
    
    fetch("/api/appointments")
      .then((res) => res.json())
      .then((res) => setAppoinments(res))
      .catch(console.error);
  }, [setAppoinments]);

  const router = useRouter();

  return (
    <div className={styles.layout}>
      <div className={styles.toolbar}>
        <h1>Citas programadas</h1>
        <button
          className={styles.button}
          onClick={() => router.push("/dashboard/appointment")}
        >
          Programar cita
        </button>
      </div>
      <div className={styles.tableContainer}>
        <AppointmentTable entries={appointments}></AppointmentTable>
      </div>
    </div>
  );
}
