import { appointmentsRoute } from "@/app/utils/routes";
import { redirect } from "next/navigation"

export const signIn = async (data) => {
  console.log(data);
  await new Promise((res) => setTimeout(res, 700));
  redirect(appointmentsRoute)
};
