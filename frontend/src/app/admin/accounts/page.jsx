import Layout from "@/app/components/base_layout/Layout";
import IndexAccounts from "./client";
import { isAdmin } from "@/app/utils/requestBuilder";

export default async function Page(){
  const isAdm = await isAdmin();
  return (
    <Layout isAdmin={isAdm}>
      <IndexAccounts/>
    </Layout>
  )
}