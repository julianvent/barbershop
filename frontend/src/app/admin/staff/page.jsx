import Layout from "@/app/components/base_layout/Layout";
import StaffIndex from "./client";
import { getEstablishmentId, isAdmin } from "@/app/utils/requestBuilder";

export default async function Page() {
  const isAdm = await isAdmin();
  const id = await getEstablishmentId();
  return (
    <Layout isAdmin={isAdm}>
      <StaffIndex isAdmin={isAdm} establishmentId={id}/>
    </Layout>
  );
}
