"use server";
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