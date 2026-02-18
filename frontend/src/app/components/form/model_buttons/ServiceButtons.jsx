import { deleteService } from "@/app/apiHandlers/adminServices";
import {
  editService,
  servicesRoute,
} from "@/app/utils/routes";
import styles from "./styles.module.css";
import { useRouter } from "next/navigation";

export default function ServiceButtons({ model, isAdmin }) {
  let id = model.id;
  const router = useRouter();
  let routes = {
    index: servicesRoute,
    edit: editService,
  };
  routes.deleteFunction = deleteService;

  return (
      <div className={styles.deleteButtons} aria-label="Botones de Accion">
        <button
          className={styles.cancelButton}
          onClick={(e) => {
            e.preventDefault();
            router.push(routes.index);
          }}
        >Regresar</button>

        <button
          onClick={(e) => {
            const url = routes.edit.replace("${id}", id);
            e.preventDefault();
            router.push(url);
          }}
        >Editar</button>

      
        {model.establishment_services&&isAdmin&&(
          <button
            className={styles.deleteButton}
            disabled={model.status == "inactive"}
            onClick={(e) => {
              e.preventDefault();
              routes.deleteFunction({id, isAdmin, establishment_id:null});
              router.push(routes.index);
            }}
          >Eliminar el servicio</button>
        )}
        
        {model.establishment_services&&isAdmin&&(
          model.establishment_services.map((service, index) => {
            return (
              <button
                key={index}
                className={styles.deleteButton}
                disabled={model.status == "inactive"}
                onClick={(e) => {
                  e.preventDefault();
                  routes.deleteFunction({id, isAdmin, establishment_id:service.establishment_id});
                  router.push(routes.index);
                }}
              >Eliminar {service.establishment_name}</button>
            )
          })
        )}

        {model.establishment_services&&!isAdmin&&(
              <button
                className={styles.deleteButton}
                disabled={model.status == "inactive"}
                onClick={(e) => {
                  e.preventDefault();
                  routes.deleteFunction({id, isAdmin, establishment_id:model.establishment_services.establishment_id});
                  router.push(routes.index);
                }}
              >Eliminar</button>
        )}

    </div>
  );
}
