"use client";
import { useEffect, useState } from "react";
import ScheduleManagement from "./client";
import { getEstablishments } from "@/app/apiHandlers/adminEstablishments";
import styles from "./styles.module.css"

export default function AdminView() {
  const [establishmentId, setEstablishmentId] = useState(null);
  const [establishments, setEstablishments] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await getEstablishments();
        setEstablishments(response);
      } catch (e) {
        
      }
    };

    load();
  }, [])
  return (
    <>
      <article>
        {establishments ? (
          <div className={styles.field}>
            <label>Selecciona el establecimiento</label>
            <select name="establishment" id="establishment" onChange={(e) =>{
              setEstablishmentId(e.target.value)
            }}>
              <option value="">Selecciona un establecimiento</option>
              {establishments.map((e) => {
                return (
                  <option key={e.id} value={e.id}>{e.name}</option>
                )
              })}
              
            </select>
          </div>
        ) : (<div>Cargando ...</div>)}

      </article>

      {establishmentId&&(<ScheduleManagement establishmentId={establishmentId}/>)}
    </>
  );
}