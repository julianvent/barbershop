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
import { servicesEntries, status, timesAvailable } from "../../../utils/data";
import { useRouter } from "next/navigation";
import { appointmentsRoute } from "@/app/utils/routes";
import { createAppointment, updateAppointment } from "../api/appointments";
import BarberFieldset from "@/app/components/form/barberSelector/BarberSelector";
import TimeSelector from "@/app/components/form/timeSelector/TimeSelector";
import ServiceSelector from "@/app/components/form/serviceSelector/ServiceSelector";
import { getEmployees } from "../../staff/api/employees";

export default function AppointmentForm({ appointment, mode }) {
  const router = useRouter();
  const [selectedBarber, setSelectedBarber] = useState(null);
  const barbers = useBarbers();

  const methods = useForm({
    defaultValues: appointment || {},
  });

  const onSubmit = (data) => {
    if (appointment) updateAppointment(data);
    else createAppointment(data);
    router.push(appointmentsRoute);
  };

  useEffect(() => {
    if (appointment) {
      methods.reset(appointment);
      setSelectedBarber(appointment.barber_id);
    }
  }, [appointment]);

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
            <BarberFieldset
              barbers={barbers}
              onChange={(e) => setSelectedBarber(e.target.value)}
              {...barberValidation}
            ></BarberFieldset>
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
                services={servicesEntries}
              ></ServiceSelector>
            </fieldset>
          </div>
          <div className={styles.buttons}>
            <button>Agendar cita</button>
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
        console.log(data.data);
        setBarbers(data.data);
      } catch (error) {
        console.error("Error fetching barbers");
      }
    }
    fetchBarbers();
  }, []);
  return barbers;
}
