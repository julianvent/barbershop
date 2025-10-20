"use client";

import AppointmentForm from "@/app/components/forms/AppointmentForm";
import React from "react";
import { useRouter } from 'next/navigation';


export default function updateAppointment({ params }) {
  const { id } = React.use(params);
    const router = useRouter();
  
  async function handleSubmit(formData){
    formData.fecha_hora_cita = formData.fecha+"T"+formData.hora+"Z";
    formData.duracion_total = Number(formData.duracion_total);
    const res = await fetch(`/api/appointments/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    router.push('/dashboard/');

  }
  return (
    <div style={{  backgroundColor: 'rgb(245, 245, 245)'}}>
      <AppointmentForm onSubmit={handleSubmit} id={id} />
    </div>
  );
}
