"use client";

import Layout from "@/app/components/base_layout/Layout";
import styles from "../Main.module.css"
import { AgGridReact } from "ag-grid-react";
import { ModuleRegistry, AllCommunityModule } from "ag-grid-community";
import { actionsDef, defaultColDef, establishmentsFields } from "@/app/utils/columns";
ModuleRegistry.registerModules([AllCommunityModule]);
import { useRouter } from "next/navigation";
import { editEstablishment, newEstablishment, seeEstablishment } from "@/app/utils/routes";
import { useEffect, useState } from "react";
import { getEstablishments } from "@/app/apiHandlers/adminEstablishments";
import { ActionButton } from "@/app/components/action/ActionButton";

export default function Page(){
  const [establishments, setEstablishments] = useState([])
  const [ message, setMessage] = useState('No se han registrado los establecimentos')

  const actions = [
    {
      name: 'see',
      route: seeEstablishment
    },
    {
      name: 'edit',
      route: editEstablishment
    }
  ];

  const columnDefs = [
    ...establishmentsFields,
    {
      ...actionsDef,
      cellRenderer: (params) => {
        const employee = params.data;
        return <ActionButton id={employee.id} actions={actions} />;
      },
    }
  ]
  useEffect(() => {
    const load = async () => {
      try {
        const response = await getEstablishments();
        setEstablishments(response);
      } catch (e) {
        setMessage('No se pudieron cargar los establecimientos')
      }
    };

    load();
  }, [])
  const router = useRouter();
  return (
    <Layout>
      <title>SGBarbershop - Ubicaciones</title>
      <div className={styles.layout}>
        
        <div className={styles.toolbar}>
          <h1>Locales registrados</h1>
          <button onClick={() => router.push(newEstablishment)}>Registrar</button>
          
        </div>

        <div className={styles.tableContainer}>
          
          <AgGridReact
            defaultColDef={defaultColDef}
            rowData={establishments}
            columnDefs={columnDefs}
            overlayNoRowsTemplate={message}
            pagination={true}
            paginationPageSize={20}
          />

        </div>
      </div>
    </Layout>
  )
}