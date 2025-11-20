"use client";
import styles from "../Main.module.css";
import { useRouter } from "next/navigation";
import Layout from "@/app/components/base_layout/Layout";
import { servicesEntries } from "@/app/utils/data";
import {
  editService,
  newBundleRoute,
  newServiceRoute,
  seeService,
} from "@/app/utils/routes";
import { serviceFields, defaultColDef } from "@/app/utils/columns";
import { ActionButton } from "@/app/components/action/ActionButton";
import { AgGridReact } from "ag-grid-react";
import { ModuleRegistry, AllCommunityModule } from "ag-grid-community";
ModuleRegistry.registerModules([AllCommunityModule]);

export default function Services() {
  const router = useRouter();
  const actions = [
    {
      name: "see",
      route: seeService,
    },
    {
      name: "edit",
      route: editService,
    },
  ];
  const fields = [
    ...serviceFields,
    {
      headerName: "Acciones",
      field: "id",
      cellRenderer: (params) => {
        const service = params.data;

        const filteredActions =
          service.tipo === "Paquete"
            ? actions.filter((a) => a.name !== "edit")
            : actions;

        return <ActionButton id={service.id} actions={filteredActions} />;
      },
      flex: 1,
    },
  ];

  return (
    <Layout>
      <div className={styles.layout}>
        <div className={styles.toolbar}>
          <h1>Servicios Disponibles</h1>
          <div className={styles.buttonContainer}>
            <button onClick={() => router.push(newServiceRoute)}>
              Crear servicio
            </button>
            <button onClick={() => router.push(newBundleRoute)}>
              Crear Paquete
            </button>
          </div>
        </div>
        <div className={styles.tableContainer}>
          <AgGridReact
            defaultColDef={defaultColDef}
            rowData={servicesEntries}
            columnDefs={fields}
          />
        </div>
      </div>
    </Layout>
  );
}
