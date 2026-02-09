"use client";
import { useParams } from "next/navigation";
import AppointmentDetail from "../../../forms/AppointmentDetail/AppointmentDetail";

export default function AppointmentDetailAdmin() {
  const { id } = useParams();

  return (
    <>
      <title>SG BarberShop - Detalle de Cita</title>
      <AppointmentDetail appointmentId={id}></AppointmentDetail>
    </>
  );
}
