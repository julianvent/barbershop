import { getEstablishmentId, isAdmin } from "@/app/utils/requestBuilder";
import Layout from "@/app/components/base_layout/Layout";
import NewService from "./client";
import AdminView from "./admin";

export default async function Page() {
  const isAdm = await isAdmin();
  const establishment = await getEstablishmentId();
  return (
    <Layout
      headerTitle={"Nuevo paquete"}
      mainTitle={"Registrar nuevo paquete"}
      isAdmin={isAdm}
    >
      <title>SG BarberShop - Crear Paquetes</title>
      {
        isAdm ? (<AdminView/>) : (<NewService isAdmin={isAdm} establishmentId={establishment}/>)
      }
    </Layout>
  );
}
