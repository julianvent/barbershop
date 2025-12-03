"use client";
import Input from "@/app/components/form/input/Input";
import Select from "@/app/components/form/input/Select";
import styles from "./Appointment-Form.module.css";
import { FormProvider, useForm } from "react-hook-form";
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
import { status, timesAvailable } from "../../../utils/data";
import { useRouter } from "next/navigation";
import { appointmentsRoute } from "@/app/utils/routes";
import { createAppointment, updateAppointment } from "../api/appointments";
import BarberSelector from "@/app/components/form/barberSelector/BarberSelector";
import TimeSelector from "@/app/components/form/timeSelector/TimeSelector";
import ServiceSelector from "@/app/components/form/serviceSelector/ServiceSelector";
import { getEmployees } from "../../staff/api/employees";
import { getServices } from "../../services/api/services";

export default function AppointmentForm({ appointment, mode }) {
  const [selectedBarber, setSelectedBarber] = useState(null);
  const router = useRouter();
  const barbers = useBarbers();
  const services = useServices();

  const methods = useForm({ defaultValues: {} });

  const onSubmit = (data) => {
    methods.clearErrors();
    if (appointment) updateAppointment(data);
    else createAppointment(data);

    router.push(appointmentsRoute);
  };

  useEffect(() => {
    if (appointment) {
      const parsedAppointment = parseAppointment(appointment);
      methods.reset(parsedAppointment);
      setSelectedBarber(parsedAppointment.barber_id);
    }
  }, [appointment, methods]);

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
              onChange={(e) => setSelectedBarber(e.target.value)}
              {...barberValidation}
            ></BarberSelector>
          </div>

          <div className={styles.fieldsContainer}>
            <h2>Datos de la cita</h2>
            <fieldset
              disabled={!selectedBarber}
              className={styles.appointmentFields}
            >
              {mode !== "customer" && (
                <Select options={status} {...statusValidation}></Select>
              )}
              <Input {...dateValidation}></Input>
              <TimeSelector
                {...timeValidation}
                times={timesAvailable}
              ></TimeSelector>
              <ServiceSelector
                {...serviceValidation}
                services={services}
              ></ServiceSelector>
            </fieldset>
          </div>
          <div className={styles.buttons}>
            <button>
              {appointment ? "Confirmar cambios" : "Programar cita"}
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
