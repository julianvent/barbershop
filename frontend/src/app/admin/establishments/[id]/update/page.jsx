import { isAdmin } from "@/app/utils/requestBuilder";
import UpdateEstablishments from "./client";


export default async function Page({params}){
  const isAdm = await isAdmin();


  return (
    <UpdateEstablishments params={params} isAdmin={isAdm}/>

  )
}