import { defaultColDef } from "@/app/utils/columns";
import { ModuleRegistry, AllCommunityModule } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
ModuleRegistry.registerModules([AllCommunityModule]);

// TODO: make this properly reusable
const appointmentServiceFields = [
  {
    headerName: "Nombre",
    field: "name",
    resizable: false,
  },
  {
    headerName: "Precio",
    field: "price",
    resizable: false,
    valueFormatter: (params) => `$${params.data.price.toFixed(2)}`,
  },
  {
    headerName: "Duración aproximada",
    field: "duration",
    valueFormatter: (params) =>
      Math.floor(params.data.duration / 60) >= 1
        ? Math.floor(params.data.duration / 60) +
          " hr " +
          (params.data.duration % 60) +
          " minutos"
        : params.data.duration + " minutos",
    resizable: false,
  },
];

export default function ServiceGrid({ services }) {
  return (
    <AgGridReact
      defaultColDef={defaultColDef}
      rowData={services}
      columnDefs={appointmentServiceFields}
    ></AgGridReact>
  );
}
