"use client";

import AppointmentForm from "../AppointmentForm/AppointmentForm";
import Layout from "@/app/components/base_layout/Layout";

export default function NewAppointment() {
  return (
    <Layout headerTitle={"Nueva cita"} mainTitle={"Agendar nueva cita"}>
      <AppointmentForm></AppointmentForm>
    </Layout>
  );
}
