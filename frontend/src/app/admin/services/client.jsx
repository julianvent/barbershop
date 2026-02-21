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
import { useEffect, useRef, useState } from "react";
import { ActionButton } from "@/app/components/action/ActionButton";
import SebasModal from "@/app/components/modal/SebasModal";
import SearchGrid from "@/app/components/base_layout/SearchGrid";
ModuleRegistry.registerModules([AllCommunityModule]);

export default function Services({isAdmin, establishment_id}) {
  const router = useRouter();
  const [services, setServices] = useState(null);
  const [message,setMessage] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [gridApi, setGridApi] = useState(null);
  const gridRef = useRef();
  const modalId = "service_prices_modal";


  useEffect(() => {
    const fetch = async() =>{
      try{
        let data;
        if (isAdmin) data = await getServices();
        else data = await getServicesByEstablishment(establishment_id);
        console.log(data)
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
    ...serviceFields(isAdmin),
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
        <article className={styles.index}>
          <SearchGrid text="Buscar servicios ..." gridApi={gridApi}/>
          <AgGridReact
            ref={gridRef}
            onGridReady={(params) => setGridApi(params.api)}
            defaultColDef={defaultColDef}
            rowData={services}
            columnDefs={fields}
            pagination={true}
            paginationPageSize={20}
            overlayNoRowsTemplate={message}
          />
        </article>
        </div>
      </div>
      <SebasModal
        id={modalId}
        title="Precios"
        confirmButton={false}
      >
        
        {selectedService?.establishment_services?.map((item, index) => (
          <div key={index}>
            {item.establishment_name} - {`$${item.price.toFixed(2)}`}
          </div>
        ))}
      </SebasModal>
    </>
  );
}
