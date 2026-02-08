import Layout from "@/app/components/base_layout/Layout";
import UpdateAppointment from "./client";
import { isAdmin } from "@/app/utils/requestBuilder";

export default async function Page({ params }) {
  const isAdm = await isAdmin();

  return (
    <Layout mainTitle={"Actualizar cita"} headerTitle={"Modificar datos"} isAdmin={isAdm}>
      <UpdateAppointment params={params}/>
    </Layout>
  );
}