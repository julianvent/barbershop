import Layout from "@/app/components/base_layout/Layout";
import { isAdmin } from "@/app/utils/requestBuilder";
import Services from "./client";


export default async function Page() {
  const isAdm = await isAdmin();


  return (
    <Layout isAdmin={isAdm}>
      <Services />
    </Layout>
  );
}
