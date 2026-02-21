import { isAdmin } from "@/app/utils/requestBuilder";
import UpdateServices from "./client";

export default async function updateServices({params}) {
  const isAdm = await isAdmin();
  return (
    <UpdateServices params={params} isAdmin={isAdm}/>
  );
}
