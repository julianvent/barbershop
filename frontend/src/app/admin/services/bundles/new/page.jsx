import { isAdmin } from "@/app/utils/requestBuilder";
import Layout from "@/app/components/base_layout/Layout";
import NewService from "./client";

export default async function Page() {
  const isAdm = await isAdmin();
  return (
    <Layout
      headerTitle={"Nuevo paquete"}
      mainTitle={"Registrar nuevo paquete"}
      isAdmin={isAdm}
    >
      <NewService isAdmin={isAdm}/>
    </Layout>
  );
}
