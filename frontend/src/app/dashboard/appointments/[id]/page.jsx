"use client";
import Layout from "@/app/components/base_layout/Layout";
import { useParams } from "next/navigation";
import AppointmentDetail from "../AppointmentDetail/AppointmentDetail";

export default function AppointmentDetailAdmin() {
  const { id } = useParams();

  return (
    <Layout headerTitle={`Detalle de cita`}>
      <title>SG BarberShop - Detalle de Cita</title>
      <AppointmentDetail appointmentId={id}></AppointmentDetail>
    </Layout>
  );
}
