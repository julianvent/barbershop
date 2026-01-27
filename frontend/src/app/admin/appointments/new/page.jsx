"use client";

import AppointmentForm from "../../../forms/AppointmentForm/AppointmentForm";
import Layout from "@/app/components/base_layout/Layout";

export default function NewAppointment() {
  return (
    <Layout headerTitle={"Nueva cita"} mainTitle={"Agendar nueva cita"}>
      <title>SG BarberShop - Agendar Cita</title>
      <AppointmentForm></AppointmentForm>
    </Layout>
  );
}
