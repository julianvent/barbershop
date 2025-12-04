import { defaultColDef } from "@/app/utils/columns";
import { ModuleRegistry, AllCommunityModule } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
ModuleRegistry.registerModules([AllCommunityModule]);

const appointmentServiceFields = [
  {
    headerName: "Nombre",
    field: "name",
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
