"use client";
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
import { getEmployees, getEmployeesByEstablishment } from "../../apiHandlers/adminStaff";
ModuleRegistry.registerModules([AllCommunityModule]);

export default function StaffIndex({isAdmin, establishmentId}) {
  const router = useRouter();
  const [employees, setEmployees] = useState();
  const [message, setMessage] = useState(null);
  
  useEffect(() => {
    setMessage('No se han registrado los servicios');
    const fetch = async () => {
      try{
        let data;
        if (isAdmin) data = await getEmployees();
        else data = await getEmployeesByEstablishment(establishmentId);
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
          true : {color:'#004b0aff', text: 'Activo' },
          false : {color:'#9d0000ff', text: 'Inactivo' }, 
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
    <>
      <title>SG BarberShop - Empleados</title>
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
            pagination={true}
            paginationPageSize={20}
          />
        </div>
      </div>
    </>
  );
}
