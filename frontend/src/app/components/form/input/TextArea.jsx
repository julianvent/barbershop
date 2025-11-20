import { useFormContext } from "react-hook-form";
import inputStyles from "@/app/components/form/input/Input.module.css";

export default function Textarea({ id, label, name, validation }) {
  const { register, formState: { errors } } = useFormContext();

  return (
    <div className={inputStyles.field}>
      <label htmlFor={id}>{label}</label>

      <textarea
        id={id}
        {...register(id, validation)}
      ></textarea>

      {errors[id] && <span role="alert">{errors[id].message}</span>}
    </div>
  );
}
