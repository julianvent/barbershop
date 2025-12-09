import { deleteService } from "@/app/admin/services/api/services";
import { deleteEmployee } from "@/app/admin/staff/api/employees";
import {
  appointmentsRoute,
  editAppointments,
  editService,
  editStaffRoute,
  servicesRoute,
  staffRoute,
} from "@/app/utils/routes";
import styles from "./styles.module.css";
import { useRouter } from "next/navigation";
import MicroModal from "micromodal";
import { deleteAppointment } from "@/app/admin/appointments/api/appointments";

export default function Buttons({ model, modelType }) {
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
          routes.deleteFunction(id);
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
        >
          Completar
        </button>
      )}
    </div>
  );
}
