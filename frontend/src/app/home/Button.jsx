'use client';

import { useRouter } from "next/navigation";

export default function Button(){
  const router = useRouter();
  return (
    <button onClick={(e) => router.push('/appointments')}>Agenda tu cita ahora</button>
  )
}