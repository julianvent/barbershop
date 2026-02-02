import EmployeeDetail from "./client";
import { isAdmin } from "@/app/utils/requestBuilder";
export default async function Page({params}){
    const isAdm = await isAdmin();
    return (
        <EmployeeDetail params={params} isAdmin={isAdm}/>
    )
}