import Layout from "@/app/components/base_layout/Layout";
import { isAdmin } from "@/app/utils/requestBuilder";
import NewEmployee from "./client";

export default async function Page() {

  const isAdm = await isAdmin();
  return (
    <Layout
      headerTitle={"Nuevo empleado"}
      mainTitle={"Registrar nuevo empleado"}
      isAdmin={isAdm}
    >
      <title>SG BarberShop - Registrar Empleado</title>
      <NewEmployee />
    </Layout>
  );
}
