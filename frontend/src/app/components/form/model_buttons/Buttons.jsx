import { deleteService } from "@/app/apiHandlers/adminServices";
import { deleteEmployee } from "@/app/apiHandlers/adminStaff";
import { deleteAppointment } from "@/app/apiHandlers/adminAppointments";
import {
  appointmentsRoute,
  editAppointments,
  editEstablishment,
  editService,
  editStaffRoute,
  establishmentRoute,
  servicesRoute,
  staffRoute,
} from "@/app/utils/routes";
import styles from "./styles.module.css";
import { useRouter } from "next/navigation";
import MicroModal from "micromodal";
import { deleteEstablishment } from "@/app/apiHandlers/adminEstablishments";

export default function Buttons({ model, modelType, isAdmin=false }) {
  let id = model.id;
  const router = useRouter();
  let routes = {};
  switch (modelType) {
    case "service":
      routes.index = servicesRoute;
      routes.edit = editService;
      routes.deleteFunction = deleteService;
      break;
    case "appointment":
      routes.index = appointmentsRoute;
      routes.edit = editAppointments;
      routes.deleteFunction = deleteAppointment;
      break;
    case "staff":
      routes.index = staffRoute;
      routes.edit = editStaffRoute;
      routes.deleteFunction = deleteEmployee;
      break;
    case "establishment":
      routes.index = establishmentRoute;
      routes.edit = editEstablishment;
      routes.deleteFunction = deleteEstablishment;
      break;
  }

  return (
    <div className={styles.buttons} aria-label="Botones de Accion">
      <button
        className={styles.cancelButton}
        onClick={(e) => {
          e.preventDefault();
          router.push(routes.index);
        }}
      >
        Regresar
      </button>

      <button
        onClick={(e) => {
          const url = routes.edit.replace("${id}", id);
          e.preventDefault();
          router.push(url);
        }}
      >
        Editar
      </button>

      <button
        className={styles.deleteButton}
        disabled={model.status == "inactive"}
        onClick={(e) => {
          e.preventDefault();
          if(modelType != "service"){
            routes.deleteFunction(id);
          } else {
            routes.deleteFunction({id, isAdmin, establishment_id:model.Establishment_id});
          }
          router.push(routes.index);
        }}
      >
        Eliminar
      </button>

      {modelType == "appointment" && (
        <button
          className={styles.completeAppointment}
          onClick={(e) => {
            e.preventDefault();
            MicroModal.show("complete-appointment-modal");
          }}
        >Completar</button>
      )}
      {modelType == "appointment" && (
        <button
          className={styles.deleteButton}
          onClick={(e) => {
            e.preventDefault();
            MicroModal.show("cancel-appointment-modal");
          }}
        >Cancelar</button>
      )}
    </div>
  );
}