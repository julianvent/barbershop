import Layout from "@/app/components/base_layout/Layout";
import { isAdmin } from "@/app/utils/requestBuilder";
import ScheduleManagement from "./client";
import AdminView from "./admin";

export default async function Page() {
  const isAdm = await isAdmin();
  let establishmentId;
  if(!isAdm){
    
  }
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