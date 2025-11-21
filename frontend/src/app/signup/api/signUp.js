import { signInRoute } from "@/app/utils/routes";
import { signUpApiRoute } from "./routes";
import { redirect } from "next/navigation";

export const signUp = async (data) => {
  data.role = "receptionist";
  console.log(data);

  try {
    const res = await fetch(signUpApiRoute, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      throw new Error("Error creating account");
    }
  } catch (err) {
    console.error(err)
    throw new Error("Server error")
  }

  redirect(signInRoute);
};
