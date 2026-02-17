import Layout from "@/app/components/base_layout/Layout";
import { isAdmin } from "@/app/utils/requestBuilder";
import Appointments from "./client";

export default async function Page() {
  const isAdm = await isAdmin();

  return (
    <Layout isAdmin={isAdm}>
      <Appointments isAdmin={isAdm}/>
    </Layout>
  );
}

