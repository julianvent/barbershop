"use client";
import { useRouter } from 'next/navigation';
import styles from '../Main.module.css'
import { editAccounts, newAccounts, seeAccounts } from '@/app/utils/routes';
import { AgGridReact } from 'ag-grid-react';
import { accountsFields, actionsDef, defaultColDef } from '@/app/utils/columns';
import { useEffect, useRef, useState } from 'react';
import { getAccounts } from '@/app/apiHandlers/account';
import { ModuleRegistry, AllCommunityModule } from "ag-grid-community";
import { ActionButton } from '@/app/components/action/ActionButton';
import SearchGrid from '@/app/components/base_layout/SearchGrid';
ModuleRegistry.registerModules([AllCommunityModule]);

export default function IndexAccounts(){
  const router = useRouter();
  const [accounts, setAccounts] = useState(null);
  const [message, setMessage] = useState('Obteniendo cuentas ...');
  const [gridApi, setGridApi] = useState(null);
  const gridRef = useRef();
  
  const actions = [
    {
      name: "edit",
      route: editAccounts,
    },
  ];

  const fields = [
    ...accountsFields,
    {
      headerName: "Role",
      resizable: false,
      cellRenderer: (params) => {
        const Map = {
          'admin': {color:'rgb(0, 75, 14)', text: 'Administrador' },
          'receptionist': {color:'rgb(0, 22, 75)', text: 'Recepcionista' },
          'barber': {color:'rgb(42, 0, 75)', text: 'Barbero' },
        };

        return (
          <span style={{
            color: Map[params.data.role]?.color,
            fontWeight: '600',
            fontSize: '0.875rem'
          }}>
            {Map[params.data.role]?.text}
          </span>
        );
      }
    },
    {
      ...actionsDef,
      cellRenderer: (params) => {
        const account = params.data;
        return <ActionButton id={account.id} actions={actions} />;
      },
    }
  ];

  useEffect(() => {
    async function load() {
      try{
        const accs = await getAccounts();
        setAccounts(accs);
      } catch (e) {
        setMessage(e);
        setAccounts([])
      }
    }

    load();
  }, []);


  return (
    <div className={styles.layout}>
      <title>SG Barbershop - Cuentas</title>
      <div className={styles.toolbar}>
        <h1>Cuentas del sistema</h1>
        <button onClick={(e) =>{
          e.preventDefault();
          router.push(newAccounts);
        }}>
          Registrar cuentas
        </button>
      </div>
        <article className={styles.index}>
          <SearchGrid text="Buscar cuentas ..." gridApi={gridApi}/>
          <AgGridReact
            ref={gridRef}
            onGridReady={(params) => setGridApi(params.api)}
            defaultColDef={defaultColDef}
            rowData={accounts}
            columnDefs={fields}
            pagination={true}
            paginationPageSize={20}
            overlayNoRowsTemplate={message}
          />
        </article>
    </div>
  )
}