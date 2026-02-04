import { isAdmin } from "@/app/utils/requestBuilder";
import ShowService from "./client";

export default async function Page({params}){
    const isAdm = await isAdmin();
        
    return (
        <ShowService params={params} isAdmin={isAdm} />
    )
}