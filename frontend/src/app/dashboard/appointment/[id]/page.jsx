"use client";

import AppointmentForm from "@/app/components/forms/AppointmentForm";
import React from "react";
import { useRouter } from 'next/navigation';


export default function showAppointment({ params }) {
    const { id } = React.use(params);
    const router = useRouter();

  
    async function handleSubmit(formData){
      router.push('/dashboard/');
    }
  return (
    <div style={{  backgroundColor: 'rgb(245, 245, 245)'}}>
      <AppointmentForm onSubmit={handleSubmit} id={id} isShow={true} />
    </div>
  );
}