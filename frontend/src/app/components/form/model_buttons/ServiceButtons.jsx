import { deleteService } from "@/app/apiHandlers/adminServices";
import {
  editService,
  servicesRoute,
} from "@/app/utils/routes";
import styles from "./styles.module.css";
import { useRouter } from "next/navigation";

export default function ServiceButtons({ model }) {
  let id = model.id;
  const router = useRouter();
  let routes = {
    index: servicesRoute,
    edit: editService,
  };
  routes.deleteFunction = deleteService;

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
    </div>
  );
}
