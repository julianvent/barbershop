import { isAdmin } from "@/app/utils/requestBuilder"
import UpdateStaff from "./client";

export default async function Page({params}){
    const isAdm = await isAdmin();

    return (
        <UpdateStaff params={params} isAdmin={isAdm}/>
    )
}