"use client";
import Layout from "@/app/components/base_layout/Layout";
import layout from "../../Main.module.css";
import React, { useEffect, useState } from "react";
import { getAppointment } from "../api/appointments";
import styles from "./styles.module.css";
import { Status } from "@/app/components/form/status/Status";
import Buttons from "@/app/components/form/model_buttons/Buttons";

export default function showAppointment({ params }) {
  const { id } = React.use(params);
  const appointment = useAppointment(id);

  function formatDate(date) {
    const dayNames = [
      "Domingo",
      "Lunes",
      "Martes",
      "Miércoles",
      "Jueves",
      "Viernes",
      "Sábado",
    ];

    const objectDate = new Date(date);
    const day = dayNames[objectDate.getDay()];
    const month = objectDate.toLocaleDateString("es-ES", { month: "long" });
    const monthFormated = month.charAt(0).toUpperCase() + month.slice(1);
    return `${day} ${objectDate.getDate()} de ${monthFormated} del ${objectDate.getFullYear()}`;
  }

  return (
    <Layout headerTitle='Ver cita'>
      <div className={layout.layout}>
        <h2>
          Cita - {appointment && formatDate(appointment.appointment_datetime)}
        </h2>

        <article>
        <div className={styles.columns}>
          {appointment != null && appointment.status == "completed" && (
            <figure className={styles.imageContainer}>
              <img
                src={
                  appointment.photo
                    ? appointment.photo
                    : "/image.svg"
                }
                alt={"Imagen de la cita " }
                className={styles.imageFitBack}
              />
              <figcaption>{'Foto de la cita - '+ formatDate(appointment.appointment_datetime)} </figcaption>
            </figure>
          )}

          <article className={styles.content}>
            <div>
              <h3>Datos del cliente</h3>
              <div className={styles.row}>
                <div className={styles.field}>
                  <label htmlFor="name">Nombre</label>
                  {appointment && <p>{appointment.customer_name}</p>}
                </div>

                <div className={styles.field}>
                  <label htmlFor="phone">Telefono</label>
                  {appointment && <p>{appointment.customer_phone}</p>}
                </div>
              </div>
            </div>

            <div>
              <h3>Datos de la cita</h3>
              <div className={styles.row}>
                <div className={styles.field}>
                  <label htmlFor="time">Fecha Estimada</label>
                  {appointment && <p>{appointment.date}</p>}
                </div>

                <div className={styles.field}>
                  <label htmlFor="date">Hora Estimada</label>
                  {appointment && <p>{appointment.time}</p>}
                </div>

                <div className={styles.field}>
                  <label htmlFor="date">Estado</label>
                  {appointment && (
                    <Status
                      id="state"
                      state={appointment.status}
                      type={"appointment"}
                    />
                  )}
                </div>
              </div>
            </div>

            <div>
              <h3>Servicios Ofrecidos</h3>
            
              <ul className={styles.list}>

                {appointment &&
                  appointment.services.map((e) => {
                    console.log(e);
                        
                    return (
                      <li key={e.id}>
                        {e.name}
                        </li>
                      );
                      
                    })}
              </ul>

            </div>
          </article>
        </div>


        </article>
        {appointment && (
          <Buttons model={appointment} modelType={"appointment"} />
        )}
        </div>


    </Layout>
  );
}

function useAppointment(appointmentId) {
  const [appointment, setAppointment] = useState(null);

  useEffect(() => {
    const fetchAppointment = async () => {
      const data = await getAppointment(appointmentId);
      setAppointment(data);
    };

    fetchAppointment();
  }, []);
  return appointment;
}
