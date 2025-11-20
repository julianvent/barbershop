import { useFormContext } from "react-hook-form";
import styles from "./Input.module.css";

const ConfirmPasswordInput = () => {
  const id = "confirmPassword";

  const {
    register,
    formState: { errors },
    watch,
  } = useFormContext();

  return (
    <div className={styles.field}>
      <label htmlFor={id}>{"Confirmar contraseña"}</label>
      <input
        id={id}
        type={"password"}
        {...register(id, {
          required: "Requerido",
          validate: (value) => {
            if (watch("password") !== value) {
              return "Las contraseñas no coinciden";
            }
          },
        })}
      />
      {errors[id] && <span role="alert">{errors[id].message}</span>}
    </div>
  );
};

export default ConfirmPasswordInput;
