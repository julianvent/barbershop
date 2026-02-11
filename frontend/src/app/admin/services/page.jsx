import Layout from "@/app/components/base_layout/Layout";
import { getEstablishmentId, isAdmin } from "@/app/utils/requestBuilder";
import Services from "./client";


export default async function Page() {
  const isAdm = await isAdmin();
  const id = await getEstablishmentId();

  return (
    <Layout isAdmin={isAdm}>
      <Services isAdmin={isAdm} establishment_id={id}/>
    </Layout>
  );
}
