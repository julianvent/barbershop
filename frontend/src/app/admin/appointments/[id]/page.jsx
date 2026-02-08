import Layout from "@/app/components/base_layout/Layout";
import { isAdmin } from "@/app/utils/requestBuilder";
import AppointmentDetailAdmin from "./client";

export default async function Page() {
  const isAdm = await isAdmin();
  return (
    <Layout headerTitle={`Detalle de cita`} isAdmin={isAdm}>
      <AppointmentDetailAdmin/>
    </Layout>
  );
}
