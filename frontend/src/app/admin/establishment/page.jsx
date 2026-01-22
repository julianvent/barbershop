"use client";

import Layout from "@/app/components/base_layout/Layout";
import styles from "../Main.module.css"
import { AgGridReact } from "ag-grid-react";
import { ModuleRegistry, AllCommunityModule } from "ag-grid-community";
import { defaultColDef } from "@/app/utils/columns";
ModuleRegistry.registerModules([AllCommunityModule]);
import { useRouter } from "next/navigation";
import { newEstablishment } from "@/app/utils/routes";
const fields = [
  {
    field: 'name',
    fieldname: 'xd'
  }
];


const establishments = [];
const message = 'No se ha registrado ningun local';

export default function Page(){
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
            columnDefs={fields}
            overlayNoRowsTemplate={message}
            pagination={true}
            paginationPageSize={20}
          />

        </div>
      </div>
    </Layout>
  )
}