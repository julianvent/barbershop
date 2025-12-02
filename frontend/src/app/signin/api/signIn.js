import { signInApiRoute } from "./routes";
import axios from "axios";

export async function signIn(data) {
  try {
    const res = await axios.post(signInApiRoute, data, {
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    return res.data;
  } catch (error) {
    throw error;
  }
}
