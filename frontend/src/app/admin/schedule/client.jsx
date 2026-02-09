"use client";

import { createSchedules, getSchedules, updateSchedules } from "@/app/apiHandlers/adminSchedule";
import { useEffect, useState } from "react";
import ScheduleForm from "@/app/forms/ScheduleForm/ScheduleForm";

export default function ScheduleManagement({establishmentId}){
  const [schedules, setSchedules] = useState(null);
  const [message, setMessage] = useState(null);
  const [isDefined, setIsDefined] = useState(true);
  
  useEffect(() => {
    async function load(id) {
      try{
        const sch = await getSchedules(id);
        if(sch.length === 0){
          setSchedules([]);
          setIsDefined(false);
        } else {
          setSchedules(sch.splice(0,7));
        }

      } catch (err) {
        setMessage(err);
      }
    };
    load(establishmentId);
  }, []);

  const modifySchedule = async (data) => {
    try {
      if(isDefined){
        await updateSchedules(establishmentId, data);
      } else {
        await createSchedules(establishmentId, data);
      }
    } catch (error) {
      return error;
    }
  };
  
  return (
    <>
      {message ? (
        <div style={{color: 'red' }}>{message}</div>
        ) : (
        <div>
          {!isDefined&&(<h2>No hay horarios para este establecimiento se crearan nuevos</h2>)}
          {schedules ? (
            <ScheduleForm schedules={schedules} onSubmit={modifySchedule}/>
          ):
          (
            <div>Cargando...</div>
          )}

        </div>
        
      )}

    </>
  );

}