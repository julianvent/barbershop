"use client";
import Layout from "@/app/components/base_layout/Layout";
import React, { useEffect, useState } from "react";
import { getAppointment } from "../api/appointments";
import styles from "./Detail-Appointment.module.css";
import { Status } from "@/app/components/form/status/Status";
import Buttons from "@/app/components/form/model_buttons/Buttons";
import ServiceGrid from "@/app/components/service_grid/ServiceGrid";

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
    <Layout headerTitle={`Detalle de cita`}>
      <div className={styles.layout}>
        <h1>
          Cita - {appointment && formatDate(appointment.appointment_datetime)}
        </h1>

        <div className={styles.dataLayout}>
          <div className={styles.dataContainer}>
            <h2>Datos del cliente</h2>
            <div className={styles.dataDistribution}>
              <div className={styles.data}>
                <label htmlFor="name">
                  <strong>Nombre</strong>
                </label>
                {appointment && <p>{appointment.customer_name}</p>}
              </div>

              <div className={styles.data}>
                <label htmlFor="phone">
                  <strong>Telefono</strong>
                </label>
                {appointment && <p>{appointment.customer_phone}</p>}
              </div>
            </div>
          </div>

          <div className={styles.dataContainer}>
            <h2>Datos de la cita</h2>
            <div className={styles.dataDistribution}>
              <div className={styles.data}>
                <label htmlFor="date">
                  <strong>Fecha programada</strong>
                </label>
                {appointment && <p>{appointment.date}</p>}
              </div>

              <div className={styles.data}>
                <label htmlFor="time">
                  <strong>Hora programada</strong>
                </label>
                {appointment && <p>{appointment.time}</p>}
              </div>

              <div className={styles.data}>
                <label htmlFor="status">
                  <strong>Estado</strong>
                </label>
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

          <div className={styles.dataContainer}>
            <h2>Servicios</h2>
            <div className={styles.servicesWrapper}>
              <div className={styles.services}>
                {appointment && (
                  <ServiceGrid services={appointment.services}></ServiceGrid>
                )}
                <p></p>
              </div>
            </div>
            <div className={styles.dataDistribution}>
              <div className={styles.data}>
                <label htmlFor="time">
                  <strong>Duración estimada</strong>
                </label>
                {appointment && <p>{appointment.total_duration} minutos</p>}
              </div>
              <div className={styles.data}>
                <label htmlFor="time">
                  <strong>Total</strong>
                </label>
                {appointment && <p>${appointment.cost_total}</p>}
              </div>
            </div>
          </div>

          {/* <div className={styles.dataContainer}>
            <div>
              <h3>Servicios Ofrecidos</h3>
              <div className={styles.table}>
                <table>
                  <tbody>
                    {appointment &&
                      appointment.services.map((e) => {
                        if (e.tipo == "Paquete") {
                          return (
                            <tr key={e.id}>
                              <td>{e.name}</td>
                              <td className={styles.noBold}>
                                <div
                                  dangerouslySetInnerHTML={{
                                    __html: e.descripcion.trim(),
                                  }}
                                />
                              </td>
                            </tr>
                          );
                        } else {
                          return (
                            <tr key={e.id}>
                              <td>{e.name}</td>
                            </tr>
                          );
                        }
                      })}
                  </tbody>
                </table>
              </div>
            </div>
          </div> */}

          {appointment != null && appointment.status == "completed" && (
            <div className={styles.dataContainer}>
              <h2>Fotos adjuntas</h2>
              <div className={styles.imageContainer}>
                <img
                  src={
                    appointment.photo
                      ? appointment.photo
                      : "https://reservoimg.s3.amazonaws.com/fotos_blog/fd1fb362-b_foto_blog.jpg"
                  }
                  alt={"Imagen de la cita "}
                />
              </div>
            </div>
          )}
        </div>

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
