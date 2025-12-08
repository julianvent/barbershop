import React, { useEffect, useState } from "react";
import { completeAppointment, getAppointment } from "../api/appointments";
import styles from "./Appointment-Detail.module.css";
import { Status } from "@/app/components/form/status/Status";
import Buttons from "@/app/components/form/model_buttons/Buttons";
import ServiceGrid from "@/app/components/service_grid/ServiceGrid";
import SebasModal from "@/app/components/modal/SebasModal";
import { FormProvider, useForm } from "react-hook-form";
import Input from "@/app/components/form/input/Input";
import { emailValidation } from "@/app/utils/accountValidators";
import { appoinmentPhotoValidation } from "@/app/utils/appointmentValidators";
import MicroModal from "micromodal";
import { appointmentsRoute } from "@/app/utils/routes";
import { useRouter } from "next/navigation";

export default function AppointmentDetail({ appointmentId, auth }) {
  const router = useRouter();
  const appointment = useAppointment(appointmentId, auth);
  const [isSubmitting, setisSubmiting] = useState(false);
  const [error, setError] = useState('');
  const methods = useForm();
  const { handleSubmit, watch, setValue, formState: { errors } } = methods;
  const [preview, setPreview] = useState(null);
  const file = watch("image");

    const onSubmit = methods.handleSubmit(
      async (data) => {
        setisSubmiting(true);
  
        try {
          await completeAppointment(data,appointmentId);
          router.push(appointmentsRoute);
        } catch (error) {
          setError('La cita no se pudo completar correctamente');
          MicroModal.close('complete-appointment-modal');
          MicroModal.show('error-appointment-modal');

        } finally {
          setisSubmiting(false);
        }
      }
    );

  useEffect(() => {
      if (file && file.length > 0) {
          const selectedFile = file[0];
          const allowedTypes = ["image/jpeg", "image/png"];
          if (allowedTypes.includes(selectedFile.type)) {
              const reader = new FileReader();
              reader.onloadend = () => setPreview(reader.result);
              reader.readAsDataURL(selectedFile);
          } else {
              setPreview(null);
          }
      } else {
      setPreview(null);
      }
  }, [file, setValue]);
  

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
    <>
      {appointment ? (
        <div className={styles.layout}>
          <h1>Cita - {formatDate(appointment.appointment_datetime)}</h1>

          <div className={styles.dataLayout}>
            <div className={styles.dataContainer}>
              <h2>Datos del cliente</h2>
              <div className={styles.dataDistribution}>
                <div className={styles.data}>
                  <label htmlFor="customer name">
                    <strong>Nombre</strong>
                  </label>
                  {<p>{appointment.customer_name}</p>}
                </div>

                <div className={styles.data}>
                  <label htmlFor="customer phone">
                    <strong>Telefono</strong>
                  </label>
                  <p>
                    {appointment.customer_phone ||
                      "No se proporcionó número de teléfono"}
                  </p>
                </div>

                <div className={styles.data}>
                  <label htmlFor="customer email">
                    <strong>Correo electrónico</strong>
                  </label>
                  {<p>{appointment.customer_email}</p>}
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
                  {<p>{appointment.date}</p>}
                </div>

                <div className={styles.data}>
                  <label htmlFor="time">
                    <strong>Hora programada</strong>
                  </label>
                  {<p>{appointment.time}</p>}
                </div>

                <div className={styles.data}>
                  <label htmlFor="status">
                    <strong>Estado</strong>
                  </label>

                  <Status
                    id="state"
                    state={appointment.status}
                    type={"appointment"}
                  />
                </div>
              </div>
            </div>

            <div className={styles.dataContainer}>
              <h2>Servicios</h2>
              <div className={styles.servicesWrapper}>
                <div className={styles.services}>
                  <ServiceGrid services={appointment.services}></ServiceGrid>
                  <p></p>
                </div>
              </div>
              <div className={styles.dataDistribution}>
                <div className={styles.data}>
                  <label htmlFor="barber">
                    <strong>Barbero</strong>
                  </label>
                  {<p>{appointment.barber.barber_name}</p>}
                </div>
                <div className={styles.data}>
                  <label htmlFor="time">
                    <strong>Duración estimada</strong>
                  </label>
                  {<p>{appointment.total_duration} minutos</p>}
                </div>
                <div className={styles.data}>
                  <label htmlFor="time">
                    <strong>Total</strong>
                  </label>
                  <p>${appointment.cost_total}</p>
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

            {appointment.status == "completed" && (
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
          <div>
            <Buttons model={appointment} modelType={"appointment"} />
          </div>
          <SebasModal
              id="complete-appointment-modal"
              title={'Confirme la cita'}
              confirmText={"Terminar cita"}
              cancelText="Cancelar"
              disabled={isSubmitting}
              onConfirm={onSubmit}>
              <FormProvider {...methods}>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                  }}
                  noValidate
                  aria-busy={isSubmitting}
                >
                  <div className={styles.fieldsContainer}>
                    <Input {...appoinmentPhotoValidation}></Input>
                    <figure className={styles.imageContainer}>
                      <img
                        src={(preview ? preview : '/image.svg')}
                        alt="Previsualizacion de la cita completada"
                        className={preview  ? styles.imageFitBack :  styles.imageFit}
                      />
                    </figure>

                  </div>
                </form>
              </FormProvider>
          </SebasModal>

          <SebasModal
              id="error-appointment-modal"
              title={'Hubo una excepcion'}
              confirmText='Confirmar'
              cancelButton={false}
              disabled={false}
              onConfirm={()=>{
                MicroModal.close('error-appointment-modal');
                MicroModal.show('complete-appointment-modal');
              }}>
                <div className={styles.errorMessage}>
                  <p>{error}</p>
                </div>


          </SebasModal>



        </div>
      ) : (
        <p style={{ textAlign: "center" }}>Cargando cita...</p>
      )}
    </>
  );
}

function useAppointment(appointmentId, auth) {
  const [appointment, setAppointment] = useState(null);

  useEffect(() => {
    const fetchAppointment = async () => {
      try {
        const data = await getAppointment(appointmentId, auth);
        setAppointment(data);
      } catch (error) {
        return null;
      }
    };

    fetchAppointment();
  }, []);
  return appointment;
}
