"use client";

import Layout from "@/app/components/base_layout/Layout";
import styles from "../Main.module.css"
import { AgGridReact } from "ag-grid-react";
import { ModuleRegistry, AllCommunityModule } from "ag-grid-community";
import { actionsDef, defaultColDef, establishmentsFields } from "@/app/utils/columns";
ModuleRegistry.registerModules([AllCommunityModule]);
import { useRouter } from "next/navigation";
import { editEstablishment, newEstablishment, seeEstablishment } from "@/app/utils/routes";
import { useEffect, useRef, useState } from "react";
import { getEstablishments } from "@/app/apiHandlers/adminEstablishments";
import { ActionButton } from "@/app/components/action/ActionButton";
import SearchGrid from "@/app/components/base_layout/SearchGrid";

export default function IndexEstablishment(){
  const [establishments, setEstablishments] = useState(null)
  const [ message, setMessage] = useState('Cargando ...');
  const [gridApi, setGridApi] = useState(null);
  const gridRef = useRef();

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
        if (response.length == 0 )  setMessage('No se han registrado los establecimentos');
        setEstablishments(response);
      } catch (e) {
        setMessage('No se pudieron cargar los establecimientos')
        setEstablishments([]);
      }
    };

    load();
  }, [])
  const router = useRouter();
  return (
    <>
      <title>SGBarbershop - Ubicaciones</title>
      <div className={styles.layout}>
        
        <div className={styles.toolbar}>
          <h1>Locales registrados</h1>
          <button onClick={() => router.push(newEstablishment)}>Registrar</button>
          
        </div>

        <div className={styles.tableContainer}>
          <article className={styles.index}>
          <SearchGrid text="Buscar establecimientos ..." gridApi={gridApi}/>
          <AgGridReact
            ref={gridRef}
            onGridReady={(params) => setGridApi(params.api)}
            defaultColDef={defaultColDef}
            rowData={establishments}
            columnDefs={columnDefs}
            pagination={true}
            paginationPageSize={20}
            overlayNoRowsTemplate={message}
          />
        </article>

        </div>
      </div>
    </>
  )
}