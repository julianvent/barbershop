"use client";
import React, { useEffect, useState } from "react";
import { getAppointment } from "../../api/appointments";
import CreateNewLayout from "@/app/components/base_layout/CreateNew/CreateNewLayout";
import { appointmentsRoute } from "@/app/utils/routes";
import AppointmentForm from "../../AppointmentForm/AppointmentForm";

export default function UpdateAppointment({ params }) {
  const { id } = React.use(params);
  const appointment = useAppointment(id);

  return (
    <CreateNewLayout title={"Actualizar cita"} returnRoute={appointmentsRoute}>
      {appointment ? (
        <AppointmentForm appointment={appointment}></AppointmentForm>
      ) : (
        <p style={{ textAlign: "center" }}>Cargando...</p>
      )}
    </CreateNewLayout>
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
