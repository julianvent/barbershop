import Layout from "@/app/components/base_layout/Layout";
import { isAdmin } from "@/app/utils/requestBuilder";
import NewService from "./client";

export default async function Page() {
  const isAdm = await isAdmin();
  return (
    <Layout
      headerTitle={"Nuevo servicio"}
      mainTitle={"Registrar nuevo servicio"}
      isAdmin={isAdm}
    >
      <NewService/>
    </Layout>
  );
}
