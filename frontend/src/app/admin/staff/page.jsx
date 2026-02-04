import Layout from "@/app/components/base_layout/Layout";
import StaffIndex from "./client";
import { isAdmin } from "@/app/utils/requestBuilder";

export default async function Page() {
  const isAdm = await isAdmin();
  return (
    <Layout isAdmin={isAdm}>
      <StaffIndex/>
    </Layout>
  );
}
