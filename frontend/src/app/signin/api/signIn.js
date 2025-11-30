import { appointmentsRoute } from "@/app/utils/routes";
import { signInApiRoute } from "./routes";
import axios from "axios";
import { redirect } from "next/navigation";

export const signIn = async (data, router) => {
  try{
    axios.post(
      signInApiRoute,
      data,
      {
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include"
      }
    );

    router.push(appointmentsRoute);

  }catch(error) {
    if (error.response) {
      console.log(error.response.data);
      console.log(error.response.status);
      console.log(error.response.headers);
    }else{
      console.log(error);
    }
  }
};
