import { isAdmin } from "@/app/utils/requestBuilder";
import AppointmentForm from "../../../forms/AppointmentForm/AppointmentForm";
import Layout from "@/app/components/base_layout/Layout";

export default async function NewAppointment() {
  const isAdm = await isAdmin();
  return (
    <Layout headerTitle={"Nueva cita"} mainTitle={"Agendar nueva cita"} isAdmin={isAdm}>
      <title>SG BarberShop - Agendar Cita</title>
      <AppointmentForm></AppointmentForm>
    </Layout>
  );
}
