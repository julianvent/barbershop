import { signUpApiRoute } from "./routes";
import axios from "axios";

axios.defaults.headers.post["Content-Type"] = "application/json";

export function signUp(data) {
  data = { ...data, role: "receptionist" };
  console.log(data);

  return axios
    .post(signUpApiRoute, data)
    .then((res) => res.data)
    .catch((error) => {
      return Promise.reject(new Error(`Error trying to sign up ${error.code}`));
    });
}
