import React, { useEffect, useState } from "react";
import { completeAppointment, getAppointment } from "../api/appointments";
import styles from "./Appointment-Detail.module.css";
import { Status } from "@/app/components/form/status/Status";
import Buttons from "@/app/components/form/model_buttons/Buttons";
import ServiceGrid from "@/app/components/service_grid/ServiceGrid";
import SebasModal from "@/app/components/modal/SebasModal";
import { FormProvider, useForm } from "react-hook-form";
import Input from "@/app/components/form/input/Input";
import { appoinmentPhotoValidation } from "@/app/utils/appointmentValidators";
import MicroModal from "micromodal";
import { appointmentsRoute } from "@/app/utils/routes";
import { useRouter } from "next/navigation";

export default function AppointmentDetail({
  appointmentId,
  auth,
  customerMode,
}) {
  const router = useRouter();
  const appointment = useAppointment(appointmentId, auth);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const methods = useForm();
  const {
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = methods;
  const [preview, setPreview] = useState(null);
  const file = watch("image");

  const onSubmit = methods.handleSubmit(async (data) => {
    setIsSubmitting(true);

    try {
      await completeAppointment(data, appointmentId);
      router.push(appointmentsRoute);
    } catch (error) {
      setError("La cita no se pudo completar correctamente");
      MicroModal.close("complete-appointment-modal");
      MicroModal.show("error-appointment-modal");
    } finally {
      setIsSubmitting(false);
    }
  });

  function onCancel() {
    setIsSubmitting(true);

    try {
    } catch (error) {
    } finally {
      setIsSubmitting(false);
    }
  }

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
                  <p htmlFor="customer name">
                    <strong>Nombre</strong>
                  </p>
                  {<p>{appointment.customer_name}</p>}
                </div>

                <div className={styles.data}>
                  <p htmlFor="customer phone">
                    <strong>Teléfono</strong>
                  </p>
                  <p>
                    {appointment.customer_phone ||
                      "No se proporcionó número de teléfono."}
                  </p>
                </div>

                <div className={styles.data}>
                  <p htmlFor="customer email">
                    <strong>Correo electrónico</strong>
                  </p>
                  <p>
                    {appointment.customer_email ||
                      "No se proporcionó correo electrónico."}
                  </p>
                </div>
              </div>
            </div>

            <div className={styles.dataContainer}>
              <h2>Datos de la cita</h2>
              <div className={styles.dataDistribution}>
                <div className={styles.data}>
                  <p htmlFor="date">
                    <strong>Fecha programada</strong>
                  </p>
                  {<p>{appointment.date}</p>}
                </div>

                <div className={styles.data}>
                  <p htmlFor="time">
                    <strong>Hora programada</strong>
                  </p>
                  {<p>{appointment.time}</p>}
                </div>

                <div className={styles.data}>
                  <p htmlFor="status">
                    <strong>Estado</strong>
                  </p>

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
                  <p htmlFor="barber">
                    <strong>Barbero</strong>
                  </p>
                  {<p>{appointment.barber.barber_name}</p>}
                </div>
                <div className={styles.data}>
                  <p htmlFor="time">
                    <strong>Duración estimada</strong>
                  </p>
                  {<p>{appointment.total_duration} minutos</p>}
                </div>
                <div className={styles.data}>
                  <p htmlFor="time">
                    <strong>Total</strong>
                  </p>
                  <p>${appointment.cost_total}</p>
                </div>
              </div>
            </div>

            {appointment.status == "completed" && (
              <div className={styles.dataContainer}>
                <h2>Fotos adjuntas</h2>
                <div className={styles.imageContainer}>
                  <img
                    src={
                      appointment.image_finish_path
                        ? appointment.image_finish_path
                        : "https://reservoimg.s3.amazonaws.com/fotos_blog/fd1fb362-b_foto_blog.jpg"
                    }
                    alt={"Imagen de la cita "}
                  />
                </div>
              </div>
            )}
          </div>

          {customerMode ? (
            <div
              className={styles.cancelContainer}
              onClick={() => MicroModal.show("cancel-appointment-modal")}
            >
              <button className={styles.cancelAppointment}>
                Cancelar cita
              </button>
            </div>
          ) : (
            <Buttons model={appointment} modelType={"appointment"} />
          )}
        </div>
      ) : (
        <p style={{ textAlign: "center" }}>Cargando cita...</p>
      )}

      <SebasModal
        id="complete-appointment-modal"
        title={"Confirme la cita"}
        confirmText={"Terminar cita"}
        cancelText="Cancelar"
        disabled={isSubmitting}
        onConfirm={onSubmit}
      >
        <FormProvider {...methods}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
            }}
            noValidate
            aria-busy={isSubmitting}
          >
            <div className={styles.fieldsContainerInside}>
              <Input {...appoinmentPhotoValidation}></Input>
              <figure className={styles.imageContainerInside}>
                <img
                  src={preview ? preview : "/image.svg"}
                  alt="Previsualizacion de la cita completada"
                  className={
                    preview ? styles.imageFitBackInside : styles.imageFitInside
                  }
                />
              </figure>
            </div>
          </form>
        </FormProvider>
      </SebasModal>

      <SebasModal
        id="error-appointment-modal"
        title={"Hubo una excepcion"}
        confirmText="Confirmar"
        cancelButton={false}
        disabled={false}
        onConfirm={() => {
          MicroModal.close("error-appointment-modal");
          MicroModal.show("complete-appointment-modal");
        }}
      >
        <div className={styles.errorMessage}>
          <p>{error}</p>
        </div>
      </SebasModal>

      <SebasModal
        id="cancel-appointment-modal"
        title={"Cancelar cita"}
        confirmText="Confirmar"
        cancelText="Volver"
        disabled={isSubmitting}
      >
        <p>
          ¿Estás seguro de cancelar la cita?
          <br /> Después de la operación, no se podrá acceder a la cita.
        </p>
      </SebasModal>
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
