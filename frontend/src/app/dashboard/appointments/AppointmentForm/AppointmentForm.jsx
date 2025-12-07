"use client";

import Input from "@/app/components/form/input/Input";
import Select from "@/app/components/form/input/Select";
import SebasModal from "@/app/components/modal/SebasModal";
import MicroModal from "micromodal";
import styles from "./Appointment-Form.module.css";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import {
  barberValidation,
  customerEmailValidation,
  customerNameValidation,
  dateValidation,
  phoneValidation,
  serviceValidation,
  statusValidation,
  timeValidation,
} from "@/app/utils/appointmentValidators";
import { useEffect, useState } from "react";
import { status } from "../../../utils/data";
import { useRouter } from "next/navigation";
import {
  createAppointment,
  getAvailabity,
  updateAppointment,
} from "../api/appointments";
import BarberSelector from "@/app/components/form/barberSelector/BarberSelector";
import TimeSelector from "@/app/components/form/timeSelector/TimeSelector";
import ServiceSelector from "@/app/components/form/serviceSelector/ServiceSelector";
import { getEmployees } from "../../staff/api/employees";
import { getServices } from "../../services/api/services";
import { appointmentsRoute } from "@/app/utils/routes";

export default function AppointmentForm({ appointment, mode }) {
  const [availableTimes, setAvailableTimes] = useState([]);
  const [minDate, setMinDate] = useState(null);
  const [formData, setFormData] = useState(null);
  const [error, setError] = useState(null);

  const router = useRouter();
  const barbers = useBarbers();
  const services = useServices();

  const methods = useForm({ defaultValues: {} });

  const handleFormValidation = (data) => {
    // Store form data and open confirmation modal
    setFormData(data);
    MicroModal.show("confirm-appointment-modal");
  };

  const confirmSubmit = async () => {
    if (!formData) return;

    methods.clearErrors();
    try {
      if (appointment) await updateAppointment(formData);
      else await createAppointment(formData);
      router.push(appointmentsRoute);
    } catch (error) {
      setError("Ocurrió un error al procesar la cita...");
      MicroModal.close("confirm-appointment-modal");
      MicroModal.show("error-appointment-modal");
    }
  };

  // -- watch values --
  const barberId = useWatch({
    name: barberValidation.id,
    control: methods.control,
  });
  const date = useWatch({
    name: dateValidation.id,
    control: methods.control,
  });

  // -- effects --
  useEffect(() => {
    if (appointment) {
      const parsedAppointment = parseAppointment(appointment);
      setMinDate(date);
      methods.reset(parsedAppointment);
    } else {
      setMinDate(getToday());
      methods.resetField("date", { defaultValue: minDate });
    }
  }, [appointment, minDate, methods]);

  useEffect(() => {
    if (barberId) {
      async function fetchAvailability(barberId) {
        try {
          const data = await getAvailabity(barberId, date);
          const barberSlots = data.barbers.find(
            (barber) => barber.barberId === barberId
          );
          const times = barberSlots.slots;

          setAvailableTimes(times);
        } catch (error) {
          setAvailableTimes([]);
        }
      }
      fetchAvailability(barberId);
    }
  }, [barberId, date]);

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(handleFormValidation)}>
        <div className={styles.formLayout}>
          <div className={styles.fieldsContainer}>
            <h2>Datos del cliente</h2>
            <fieldset className={styles.customerFields}>
              <Input {...customerNameValidation}></Input>
              <Input {...phoneValidation}></Input>
              <Input {...customerEmailValidation}></Input>
            </fieldset>
          </div>

          <div className={styles.fieldsContainer}>
            <h2>Selecciona un barbero</h2>
            <BarberSelector
              barbers={barbers}
              {...barberValidation}
            ></BarberSelector>
          </div>

          <div className={styles.fieldsContainer}>
            <h2>Datos de la cita</h2>
            <fieldset disabled={!barberId} className={styles.appointmentFields}>
              {mode !== "customer" && (
                <Select options={status} {...statusValidation}></Select>
              )}
              <Input {...dateValidation} minDate={minDate}></Input>
              <TimeSelector
                {...timeValidation}
                times={availableTimes}
              ></TimeSelector>
              <ServiceSelector
                {...serviceValidation}
                services={services}
              ></ServiceSelector>
            </fieldset>
          </div>
          <div className={styles.buttons}>
            <button
              className={styles.button}
              type="submit"
              disabled={methods.formState.isSubmitting}
            >
              {methods.formState.isSubmitting
                ? appointment
                  ? "Actualizando..."
                  : "Programando cita..."
                : appointment
                ? "Confirmar cambios"
                : "Programar cita"}
            </button>

            <SebasModal
              id="confirm-appointment-modal"
              title={appointment ? "Confirmar cambios" : "Confirmar nueva cita"}
              confirmText={appointment ? "Guardar cambios" : "Crear cita"}
              cancelText="Cancelar"
              disabled={methods.formState.isSubmitting}
              onConfirm={confirmSubmit}
            >
              <p>
                {appointment
                  ? "¿Estás seguro de que deseas actualizar esta cita?"
                  : "¿Estás seguro de que deseas crear esta cita?"}
              </p>
              <br />
              {formData && (
                <div>
                  <p>
                    <strong>Cliente:</strong> {formData.customer_name}
                  </p>
                  <p>
                    <strong>Teléfono:</strong> {formData.customer_phone}
                  </p>
                  <p>
                    <strong>Barbero:</strong>{" "}
                    {
                      barbers.find((barber) => barber.id == barberId)
                        .barber_name
                    }
                  </p>
                  <p>
                    <strong>Fecha:</strong> {formData.date}
                  </p>
                  <p>
                    <strong>Hora:</strong> {formData.time}
                  </p>

                  <p>
                    <strong>Servicios: </strong>
                    {formData.services_ids
                      .map((id) => {
                        const service = services.find(
                          (service) => id == service.id
                        );
                        return service.name;
                      })
                      .toString()}
                  </p>
                </div>
              )}
            </SebasModal>

            <SebasModal
              id="error-appointment-modal"
              title="Error al procesar la cita"
              confirmText="Entendido"
              cancelButton={false}
              onConfirm={() => setError("")}
            >
              <p>{error}</p>
            </SebasModal>
          </div>
        </div>
      </form>
    </FormProvider>
  );
}

function useBarbers() {
  const [barbers, setBarbers] = useState([]);

  useEffect(() => {
    async function fetchBarbers() {
      try {
        const data = await getEmployees();
        setBarbers(data.data);
      } catch (error) {
        return barbers;
      }
    }
    fetchBarbers();
  }, []);
  return barbers;
}

function useServices() {
  const [services, setServices] = useState([]);

  useEffect(() => {
    async function fetchServices() {
      try {
        const data = await getServices();
        setServices(data);
      } catch (error) {
        return services;
      }
    }
    fetchServices();
  }, []);
  return services;
}

function parseAppointment(appointment) {
  const parsed = { ...appointment };

  // convert barber id into a string, since radio input works with string values
  parsed.barber_id = String(parsed.barber?.barber_id ?? parsed.barber_id ?? "");

  // convert services ids into strings, since checkbox input works with string values
  const services_ids = (parsed.services || []).map((service) =>
    String(service.id)
  );
  parsed.services_ids = services_ids;

  return parsed;
}

function getToday() {
  const date = new Date();
  var dd = String(date.getDate()).padStart(2, "0");
  var mm = String(date.getMonth() + 1).padStart(2, "0");
  var yyyy = date.getFullYear();

  const today = yyyy + "-" + mm + "-" + dd;
  return today;
}
