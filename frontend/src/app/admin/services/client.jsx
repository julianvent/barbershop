"use client";
import styles from "../Main.module.css";
import { useRouter } from "next/navigation";
import {
  editService,
  newBundleRoute,
  newServiceRoute,
  seeService,
} from "@/app/utils/routes";
import { serviceFields, defaultColDef, actionsDef } from "@/app/utils/columns";
import { AgGridReact } from "ag-grid-react";
import { ModuleRegistry, AllCommunityModule } from "ag-grid-community";
import { getServices, getServicesByEstablishment } from "../../apiHandlers/adminServices";
import { useEffect, useState } from "react";
import { ActionButton } from "@/app/components/action/ActionButton";
ModuleRegistry.registerModules([AllCommunityModule]);

export default function Services({isAdmin, establishment_id}) {
  const router = useRouter();
  const [services, setServices] = useState(null);
  const [message,setMessage] = useState(null);

  useEffect(() => {
    const fetch = async() =>{
      try{
        let data;
        if (isAdmin) data = await getServices();
        else data = await getServicesByEstablishment(establishment_id);
        setServices(data);
        
      }catch(err){
        setServices([]);
        setMessage(err);
      }

    }
    fetch();
  },[]);


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
      headerName: "Estado",
      resizable: false,
      cellRenderer: (params) => {
        const Map = {
          'active': {color:'#004b0aff', text: 'Activo' },
          'inactive': {color:'#9d0000ff', text: 'Inactivo' },
        };

        return (
          <span style={{
            color: Map[params.data.status].color,
            fontWeight: '600',
            fontSize: '0.875rem'
          }}>
            {Map[params.data.status].text}
          </span>
        );
      }
    }
    ,
    {
      ...actionsDef,
      cellRenderer: (params) => {
        const service = params.data;
        return <ActionButton id={service.id} actions={actions} />;
      },
    }

  ];


  return (
    <>
      <title>SG BarberShop - Servicios</title>
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
            rowData={services}
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
