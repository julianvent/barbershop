"use client";

import Input from "@/app/components/form/input/Input";
import Select from "@/app/components/form/input/Select";
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

  const router = useRouter();
  const barbers = useBarbers();
  const services = useServices();

  const methods = useForm({ defaultValues: {} });

  // -- watch values --
  const barber_id = useWatch({
    name: barberValidation.id,
    control: methods.control,
  });
  const date = useWatch({ name: dateValidation.id, control: methods.control });

  const onSubmit = async (data) => {
    methods.clearErrors();

    try {
      if (appointment) await updateAppointment(data);
      else await createAppointment(data);
      router.push(appointmentsRoute);
    } catch (error) {
      // TODO: Show error properly
      console.error(error);
    }
  };

  useEffect(() => {
    if (appointment) {
      const parsedAppointment = parseAppointment(appointment);
      methods.reset(parsedAppointment);
    }
  }, [appointment, methods]);

  useEffect(() => {
    if (barber_id) {
      async function fetchAvailability(barberId) {
        try {
          const data = await getAvailabity(barberId, date);
          const barberSlots = data.barbers.filter(
            (barber) => barber.barberId === barberId
          );
          const times = barberSlots[0].slots;

          setAvailableTimes(times);
        } catch (error) {
          console.error(error);
        }
      }
      fetchAvailability(barber_id);
    }
  }, [barber_id, date]);

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
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
            <fieldset
              disabled={!barber_id}
              className={styles.appointmentFields}
            >
              {mode !== "customer" && (
                <Select options={status} {...statusValidation}></Select>
              )}
              <Input {...dateValidation} onChange={(e) => {}}></Input>
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
            <button disabled={methods.formState.isSubmitting}>
              {methods.formState.isSubmitting
                ? appointment
                  ? "Actualizando..."
                  : "Programando cita..."
                : appointment
                ? "Confirmar cambios"
                : "Programar cita"}
            </button>
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
        console.error("Error fetching barbers");
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
        console.error("Error fetching services");
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
