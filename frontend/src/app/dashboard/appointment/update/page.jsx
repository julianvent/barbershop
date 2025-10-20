"use client";

import { useRouter } from 'next/navigation';
import AppointmentForm from "@/app/components/forms/AppointmentForm";

export default function Dashboard() {
  const router = useRouter();
  function handleSubmit(formData){
    console.log(formData);
    console.log("Actualizando");
  }
  return (
    <div style={{  backgroundColor: 'rgb(245, 245, 245)'}}>
      <AppointmentForm onSubmit={handleSubmit} id={{id: 1}} />
    </div>
  );
}
