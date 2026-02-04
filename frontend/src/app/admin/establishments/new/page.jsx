import Layout from "@/app/components/base_layout/Layout";
import { isAdmin } from "@/app/utils/requestBuilder";
import CreateEstablishment from "./client"

export default async function Page () {
  const isAdm = await isAdmin()


  return (
   <Layout
    headerTitle='Nuevo Establecimiento'
    mainTitle='Registrar nuevo establecimiento'
    isAdmin={isAdm}
    >
      <CreateEstablishment/>
   </Layout> 
  )
}