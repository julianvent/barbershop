"use client";
import Layout from "@/app/components/base_layout/Layout";
import styles from "../Main.module.css";
import { useRouter } from "next/navigation";
import {
  editStaffRoute,
  newStaffRoute,
  seeStaffRoute,
} from "@/app/utils/routes";
import { actionsDef, defaultColDef, employeesEntries } from "@/app/utils/columns";
import { AgGridReact } from "ag-grid-react";
import { ModuleRegistry, AllCommunityModule } from "ag-grid-community";
import { ActionButton } from "@/app/components/action/ActionButton";
import { useEffect, useState } from "react";
import { getEmployees } from "./api/employees";
ModuleRegistry.registerModules([AllCommunityModule]);

export default function Page() {
  const router = useRouter();
  const [employees, setEmployees] = useState();
  const [message, setMessage] = useState(null);
  
  useEffect(() => {
    setMessage('No se han registrado los servicios');
    const fetch = async () => {
      try{
        const data = await getEmployees();
        setEmployees(data.data);

      }catch (err){
        setEmployees([]);
        setMessage(err);
      }
    }

    fetch();
  },[]);

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
      headerName: "Estado",
      resizable: false,
      cellRenderer: (params) => {        
        const Map = {  
          true : {color:'#10B981', text: 'Activo' },
          false : {color:'#EF4444', text: 'Inactivo' }, 
        };
        
        return (
          <span style={{
            color: Map[params.data.is_active].color,
            fontWeight: '600',
            fontSize: '0.875rem'
          }}>
            {Map[params.data.is_active].text}
          </span>
        );
      }
    },
    {
      ...actionsDef,
      cellRenderer: (params) => {
        const employee = params.data;
        return <ActionButton id={employee.id} actions={actions} />;
      },
    }
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
            rowData={employees}
            columnDefs={fields}
            overlayNoRowsTemplate={message}
          />
        </div>
      </div>
    </Layout>
  );
}
