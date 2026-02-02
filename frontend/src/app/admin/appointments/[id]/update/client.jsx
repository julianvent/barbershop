"use client";
import React, { useEffect, useState } from "react";
import { getAppointment } from "../../../../apiHandlers/adminAppointments";
import AppointmentForm from "../../../../forms/AppointmentForm/AppointmentForm";

export default function UpdateAppointment({ params }) {
  const { id } = React.use(params);
  const appointment = useAppointment(id);

  return (
    <>
      <title>SG BarberShop - Actualizar Cita</title>
      {appointment ? (
        <AppointmentForm appointment={appointment}></AppointmentForm>
      ) : (
        <p style={{ textAlign: "center" }}>Cargando...</p>
      )}
    </>
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
