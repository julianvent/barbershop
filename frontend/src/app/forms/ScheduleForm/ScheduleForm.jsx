import { useEffect, useState } from "react";
import { FormProvider, useFieldArray, useForm } from "react-hook-form";
import Input from "../../components/form/input/Input";
import { endTimeValidation, startTimeValidation, statusValidation } from "../../utils/scheduleValidator";
import styles from "./styles.module.css";
import toast from "react-hot-toast";
import layout from "@/app/admin/Main.module.css"



export default function ScheduleForm({ onSubmit, schedules }){
  const [ isCreatingSchedules, setIsCreatingSchedules] = useState(false);

  const methods = useForm({
    defaultValues: {
      schedules: [{ firstName: "Bill", lastName: "Luo" }] || schedules
    }
  });

  const {fields} = useFieldArray({
    control: methods.control,
    name: 'schedules',
    rules: { maxLength: 7  }
  });

  useEffect(() =>{
    if(schedules) {
      methods.reset({schedules})
    }
  },[methods, schedules]);

  const submit = methods.handleSubmit(async (data) => {
    setIsCreatingSchedules(true);
    console.log(data)
    const err = await onSubmit(data);
    

      if (err) {
        toast.error(err);
        setIsCreatingSchedules(false);
      }else{
        toast.success("Se actualizaron los datos exitosamente")
      }
  });
    function formatDate(day) {
      const dayNames = {
        Sunday : "Domingo",
        Monday : "Lunes",
        Tuesday : "Martes",
        Wednesday : "Miércoles",
        Thursday :"Jueves",
        Friday : "Viernes",
        Saturday : "Sábado",
      };

      return dayNames[day];
  }

  const states = [
    {id: "", value: "", name: "Seleccione un valor"},
    {id: 0, value: true, name: "Laboral"},
    {id: 1, value: false, name: "No Laboral"},
  ]
  return (
    <FormProvider {...methods}>
      <form onSubmit={e => {
        e.preventDefault();
        submit();
      }}>
        <div className= {layout.layoutShow}>

        
        <article className={styles.container}>
          {fields.map((item, index) => {
            const isActive = methods.watch(`schedules.${index}.is_active`);
            return (
              <div key={item.id}>
                <h3>{formatDate(schedules[index].day_of_week)}</h3>
                <Input id={`schedules.${index}.start_time`} name={`schedules.${index}.start_time`} disabled={!isActive} {...startTimeValidation}/>
                <Input id={`schedules.${index}.end_time`} name={`schedules.${index}.end_time`} disabled={!isActive} {...endTimeValidation}/>
                <Input options={states} id={`schedules.${index}.is_active`} name={`schedules.${index}.is_active`} {...statusValidation}/>           
              </div>
            )
          })}
        </article>
        <div className={styles.fieldsConta}>
          <div className={styles.buttons}>
            <button type="submit">Confirmar</button>
          </div>
        </div>
        </div>
      </form>
    </FormProvider>
  )
}