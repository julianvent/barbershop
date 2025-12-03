"use client";
import React, { useEffect, useState } from "react";
import { getAppointment } from "../../api/appointments";
import { appointmentsRoute } from "@/app/utils/routes";
import AppointmentForm from "../../AppointmentForm/AppointmentForm";
import Layout from "@/app/components/base_layout/Layout";

export default function UpdateAppointment({ params }) {
  const { id } = React.use(params);
  const appointment = useAppointment(id);

  return (
    <Layout mainTitle={"Actualizar cita"} headerTitle={"Modificar datos"}>
      {appointment ? (
        <AppointmentForm appointment={appointment}></AppointmentForm>
      ) : (
        <p style={{ textAlign: "center" }}>Cargando...</p>
      )}
    </Layout>
  );
}

function useAppointment(appointmentId) {
  const [appointment, setAppointment] = useState(null);

  useEffect(() => {
    const fetchAppointment = async () => {
      const data = await getAppointment(appointmentId);
      setAppointment(data);
    };

    fetchAppointment();
  }, []);
  return appointment;
}
