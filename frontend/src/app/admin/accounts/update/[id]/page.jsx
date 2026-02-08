import { isAdmin } from "@/app/utils/requestBuilder"
import ShowAccount from "./client";

export default async function Page({params}) {
  const isAdm = await isAdmin();
  return (
    <ShowAccount params={params} isAdmin={isAdm}/>
  )
}