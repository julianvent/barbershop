import Layout from "@/app/components/base_layout/Layout";
import { isAdmin } from "@/app/utils/requestBuilder";
import ScheduleManagement from "./client";
import AdminView from "./admin";

export default async function Page() {
  const isAdm = isAdmin();
  // recuperarlo del token o de algo
  const establishmentId = 1;
  return (
    <Layout isAdmin={isAdm}
    mainTitle={'Horario del Establecimiento'}>
      <title>SG Barbershop - Horarios</title>
        {
          isAdm ? (<AdminView/>) : (<ScheduleManagement id={establishmentId} />)
        }
    </Layout>
  )
}