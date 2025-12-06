"use server";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export const axiosConfig = async () => {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    return { headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        }
    }
}

export const getId = async () => {

    try{
        
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;
        const payload = JSON.parse(
            Buffer.from(token.split('.')[1], 'base64').toString()
        );

        return payload.sub;
    } catch(err){
        throw 'Bad Token';
    }
};

export const logOut = async () => {
    try{
        const cookieStore = await cookies();
        cookieStore.delete("token");
        redirect('/');
    } catch(err){
        redirect('/');
    }
}