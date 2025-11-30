import { signUpApiRoute } from "./routes";
import { redirect } from "next/navigation";
import axios from "axios";

axios.defaults.headers.post["Content-Type"] = "application/json";

export function signUp(data) {
  data = { ...data, role: "receptionist" };
  console.log(data);

  try {
    axios.post(
      signUpApiRoute,
      data,
      {
        headers: {
          "Content-Type": "application/json",
        }
      }
    );

    redirect(signInRoute);


  }catch(error) {
    if (error.response) {
      console.log(error.response.data);
      console.log(error.response.status);
      console.log(error.response.headers);
    }
  }

};
