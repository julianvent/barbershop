"use client";
import Layout from "@/app/components/base_layout/Layout";
import styles from "../Main.module.css";
import { useRouter } from "next/navigation";
import {
  editStaffRoute,
  newStaffRoute,
  seeStaffRoute,
} from "@/app/utils/routes";
import { indexBarbers } from "@/app/utils/data";
import { defaultColDef, employeesEntries } from "@/app/utils/columns";
import { AgGridReact } from "ag-grid-react";
import { ModuleRegistry, AllCommunityModule } from "ag-grid-community";
import { ActionButton } from "@/app/components/action/ActionButton";
ModuleRegistry.registerModules([AllCommunityModule]);

export default function Page() {
  const router = useRouter();

  const actions = [
    {
      name: "see",
      route: seeStaffRoute,
    },
    {
      name: "edit",
      route: editStaffRoute,
    },
  ];

  const fields = [
    ...employeesEntries,
    {
      headerName: "Acciones",
      field: "id",
      cellRenderer: (params) => (
        <ActionButton id={params.data.id} actions={actions} />
      ),
      flex: 1,
    },
  ];

  return (
    <Layout>
      <div className={styles.layout}>
        <div className={styles.toolbar}>
          <h1>Personal</h1>
          <button
            className={styles.button}
            onClick={() => router.push(newStaffRoute)}
          >
            Registrar empleado
          </button>
        </div>
        <div className={styles.tableContainer}>
          <AgGridReact
            defaultColDef={defaultColDef}
            rowData={indexBarbers}
            columnDefs={fields}
          />
        </div>
      </div>
    </Layout>
  );
}
