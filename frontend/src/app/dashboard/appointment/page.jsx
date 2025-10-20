"use client";

import { useRouter } from 'next/navigation';
import AppointmentForm from "@/app/components/forms/AppointmentForm";

export default function Dashboard() {
  const router = useRouter();
  function handleSubmit(formData){
    console.log("dik");
    console.log(formData);
  }
  return (
    <div style={{  backgroundColor: 'rgb(245, 245, 245)'}}>
      <AppointmentForm onSubmit={handleSubmit} />
    </div>
  );
}
