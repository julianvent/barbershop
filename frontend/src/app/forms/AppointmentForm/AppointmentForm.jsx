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
  establishmentValidation
} from "@/app/utils/appointmentValidators";
import { useEffect, useEffectEvent, useMemo, useState, useRef } from "react";
import { status } from "../../utils/data";
import { useRouter } from "next/navigation";
import {
  createAppointment,
  getAvailabity,
  updateAppointment,
} from "../../apiHandlers/adminAppointments";
import BarberSelector from "@/app/components/form/barberSelector/BarberSelector";
import TimeSelector from "@/app/components/form/timeSelector/TimeSelector";
import ServiceSelector from "@/app/components/form/serviceSelector/ServiceSelector";
import { getEmployeesByEstablishment } from "../../apiHandlers/adminStaff";
import { getServices, getServicesByEstablishment } from "../../apiHandlers/adminServices";
import { appointmentsRoute } from "@/app/utils/routes";
import { getEstablishments } from "@/app/apiHandlers/adminEstablishments";

export default function AppointmentForm({ appointment, mode }) {
  const [availableTimes, setAvailableTimes] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [minDate, setMinDate] = useState(null);
  const [formData, setFormData] = useState(null);
  const [error, setError] = useState(null);

  const [barbers, setBarbers] = useState([]);
  const [services, setServices] = useState([]);
  const router = useRouter();
  const establishments = useEstablishment();
  
  // Track if this is the initial load to avoid clearing form data
  const isInitialLoad = useRef(true);

  const methods = useForm({ defaultValues: {} });

  const handleFormValidation = (data) => {
    // Store form data and open confirmation modal
    setFormData(data);
    if (data.establishment_id != "") MicroModal.show("confirm-appointment-modal");
  };

  const confirmSubmit = async () => {
    if (!formData) return;

    methods.clearErrors();
    setIsSubmitting(true);
    try {
      if (appointment) await updateAppointment(formData);
      else await createAppointment(formData);
      router.push(appointmentsRoute);
    } catch (error) {
      setError("Ocurrió un error al procesar la cita...");
      MicroModal.close("confirm-appointment-modal");
      MicroModal.show("error-appointment-modal");
    } finally {
      setIsSubmitting(false);
    }
  };

  // -- watch values --
  const establishmentId = useWatch({
    name: establishmentValidation.id,
    control: methods.control,
  });
  const barberId = useWatch({
    name: barberValidation.id,
    control: methods.control,
  });
  const date = useWatch({
    name: dateValidation.id,
    control: methods.control,
  });
  const servicesIds = useWatch({
    name: serviceValidation.id,
    control: methods.control,
  });

  // -- memos --
  const { totalPrice, totalDuration } = useMemo(
    () => calculateTotal(servicesIds, services),
    [servicesIds, services]
  );

  // -- effects --
  useEffect(() => {
    if (appointment) {
      const parsedAppointment = parseAppointment(appointment);
      setMinDate(date);
      methods.reset(parsedAppointment);
      // Mark as initial load complete after setting appointment data
      isInitialLoad.current = true;
    } else {
      setMinDate(getToday());
      methods.resetField("date", { defaultValue: minDate });
      isInitialLoad.current = false;
    }
  }, [appointment]); // Only reset when appointment prop changes, not when services/establishments change
  
  useEffect(() => {
    if (barberId) {
      async function fetchAvailability(barberId) {
        try {
          const data = await getAvailabity(barberId, date);
          const barberSlots = data.barbers.find(
            (barber) => barber.barberId == barberId
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

  useEffect(() => {
    if (establishmentId) {
      async function fetchAvailability(establishmentId) {
        try {
          setAvailableTimes([]);
          setServices([]);
          setBarbers([]);
          
          // Only clear form selections if this is a user-initiated change (not initial load)
          if (!isInitialLoad.current) {
            methods.setValue('barber_id', '');
            methods.setValue('services_ids', []);
            methods.setValue('time', '');
          }
          
          const dataEmployees = await getEmployeesByEstablishment(establishmentId);
          setBarbers(dataEmployees.data);

          const dataService = await getServicesByEstablishment(establishmentId);
          setServices(dataService);
          
          // After first establishment load, mark initial load as complete
          if (isInitialLoad.current) {
            isInitialLoad.current = false;
          }
        } catch (error) {
          setServices([]);
          setBarbers([]);
        }
      }
      fetchAvailability(establishmentId);
    }
  }, [establishmentId, methods]);

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(handleFormValidation)}>
        <div className={styles.formLayout}>
          <div className={styles.fieldsContainer}>
            <fieldset className={styles.customerFields}>
              <legend>
                <h2>
                  {mode === "customer" ? "Mis datos" : "Datos del cliente"}
                </h2>
              </legend>
              <Input {...customerNameValidation}></Input>
              <Input {...phoneValidation}></Input>
              <Input {...customerEmailValidation}></Input>
            </fieldset>
          </div>

          <div className={styles.fieldsContainer}>
            <h2>Seleccione el establecimiento deseado:</h2>
            <Select options={establishments} {...establishmentValidation}></Select>
          </div>

          <div className={styles.fieldsContainer}>
            <BarberSelector
              barbers={barbers}
              {...barberValidation}
            ></BarberSelector>
          </div>

          <div className={styles.fieldsContainer}>
            <fieldset disabled={!barberId} className={styles.appointmentFields}>
              <legend>
                <h2>Datos de la cita</h2>
              </legend>
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
            <div className={styles.total}>
              <p>
                <strong>Total: </strong>
                {totalPrice
                  ? `$${totalPrice}`
                  : "Selecciona servicios para calcular el precio"}
              </p>
              <p>
                <strong>Duración estimada: </strong>
                {totalDuration
                  ? `${totalDuration} minutos`
                  : "Selecciona servicios para calcular la duración"}
              </p>
            </div>
          </div>
          <div className={styles.buttons}>
            <button
              className={styles.button}
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? appointment
                  ? "Actualizando..."
                  : "Programando cita..."
                : appointment
                ? "Confirmar cambios"
                : "Programar cita"}
            </button>

            {establishmentId&&servicesIds&&(<SebasModal
              id="confirm-appointment-modal"
              title={appointment ? "Confirmar cambios" : "Confirmar nueva cita"}
              confirmText={appointment ? "Guardar cambios" : "Crear cita"}
              cancelText="Cancelar"
              disabled={isSubmitting}
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
                  <br />

                  <p>
                    <strong>Establecimiento:</strong>{" "}
                    {
                      establishments.find((establishment) => establishment.id == establishmentId)
                        .name
                    }
                  </p>
                  <p>
                    <strong>Barbero:</strong>{" "}
                    {
                      barbers.find((barber) => barber.id == barberId)
                        ?.barber_name ?? "N/A"
                    }
                  </p>

                  <p>
                    <strong>Fecha: </strong> {formData.date}
                  </p>
                  <p>
                    <strong>Hora: </strong> {formData.time}
                  </p>
                  <br />
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
                  <p>
                    <strong>Total: </strong>${totalPrice}
                  </p>
                  <p>
                    <strong>Duración estimada: </strong>
                    {totalDuration} minutos
                  </p>
                </div>
              )}
            </SebasModal>)}

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

function useEstablishment() {
  const [establishment, setEstablishment] = useState([]);

  useEffect(() => {
    async function fetchEstablishments() {
      try {
        const data = await getEstablishments();
        const es =data.map((e) => {
          return {
            id: e.id,
            value: e.id,
            name: e.name
          }
        })
        const locals = [
          {
            id: "",
            value: "",
            name: "Selecciona un establecimiento"
          },
          ...es]
        setEstablishment(locals);
      } catch (error) {
        return establishment;
      }
    }
    fetchEstablishments();
  }, []);
  return establishment;  
}

function parseAppointment(appointment) {
  const parsed = { ...appointment };
  // convert barber id into a string, since radio input works with string values
  parsed.barber_id = String(parsed.barber?.barber_id ?? parsed.barber_id ?? "");
  parsed.establishment_id = String(parsed.establishment_id ?? "");
  console.log(parsed)

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

function calculateTotal(servicesIds = [], services) {
  let totalPrice = 0;
  let totalDuration = 0;
  if(servicesIds){
    servicesIds.forEach((id) => {
      const service = services.find((service) => service.id == id);
      if (service) {
        totalPrice += service.price;
        totalDuration += service.duration;
      }
    });

  }
  return { totalPrice, totalDuration };
}
