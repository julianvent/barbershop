"use client";
import styles from "../Main.module.css";
import { useRouter } from "next/navigation";
import Layout from "@/app/components/base_layout/Layout";
import {
  editAppointments,
  newAppointmentRoute,
  seeAppointments,
} from "@/app/utils/routes";
import { AgGridReact } from "ag-grid-react";
import { ModuleRegistry, AllCommunityModule } from "ag-grid-community";
ModuleRegistry.registerModules([AllCommunityModule]);
import { defaultColDef, appointmentColumns, actionsDef } from "@/app/utils/columns";
import { ActionButton } from "@/app/components/action/ActionButton";
import { getAppointments } from "./api/appointments";
import { useEffect, useState } from "react";

export default function Appointments() {
  const appointments = useAppointments();

  const router = useRouter();

  const actions = [
    {
      name: "see",
      route: seeAppointments,
    },
    {
      name: "edit",
      route: editAppointments,
    },
  ];

  const fields = [
    ...appointmentColumns,
    {
      headerName: "Estado",
      resizable: false,
      cellRenderer: (params) => {
        const Map = {
          pending: { color: "#4e4e4e", text: "Pendiente" },
          confirmed: { color: "#0247b6ff", text: "Confirmada" },
          completed: { color: '#004b0aff', text: "Completada" },
          cancelled: { color: "#9d0000ff", text: "Cancelada" },
        };

        return (
          <span
            style={{
              color: Map[params.data.status].color,
              fontWeight: "600",
              fontSize: "0.875rem",
            }}
          >
            {Map[params.data.status].text}
          </span>
        );
      },
    },
    {
      ...actionsDef,
      cellRenderer: (params) => (
        <ActionButton id={params.data.id} actions={actions} />
      ),
    },
  ];

  return (
    <Layout>
      <title>SG BarberShop - Citas</title>
      <div className={styles.layout}>
        <div className={styles.toolbar}>
          <h1>Citas programadas</h1>
          <button
            className={styles.button}
            onClick={() => router.push(newAppointmentRoute)}
          >
            Nueva cita
          </button>
        </div>
        <AgGridReact
          defaultColDef={defaultColDef}
          rowData={appointments}
          columnDefs={fields}
        />
      </div>
    </Layout>
  );
}

function useAppointments() {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const fetchAppointments = async () => {
      const data = await getAppointments();
      setAppointments(data);
    };

    fetchAppointments();
  }, []);
  return appointments;
}
