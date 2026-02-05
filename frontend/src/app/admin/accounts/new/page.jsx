import { isAdmin } from "@/app/utils/requestBuilder";
import CreateAccount from "./client";
import Layout from "@/app/components/base_layout/Layout";

export default async function Page(){
  const isAdm = await isAdmin();
  return (
    <Layout
      isAdmin={isAdm}
      headerTitle={'Crear cuenta'}
      mainTitle={'Registrar cuenta en el sistema'}
    >
      <CreateAccount/>
    </Layout>
  )
}