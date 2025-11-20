import { deleteService } from "@/app/dashboard/services/api/services";
import { deleteEmployee } from "@/app/dashboard/staff/api/employees";
import { appointmentsRoute, editAppointments, editService, editStaffRoute, servicesRoute, staffRoute } from "@/app/utils/routes";
import styles from "./styles.module.css";
import { useRouter } from "next/navigation";

export default function Buttons({id,modelType, service}){
    const router = useRouter();
    let routes = {}
    switch (modelType){
        case 'service': 
            routes.index = servicesRoute;
            routes.edit = editService;
            routes.deleteFunction = deleteService;
            break;
        case 'appointment': 
            routes.index = appointmentsRoute;
            routes.edit = editAppointments;
            routes.deleteFunction = deleteService; // falta ruta de eliminar cita
            break;
        case 'staff':
            routes.index = staffRoute;
            routes.edit = editStaffRoute;
            routes.deleteFunction = deleteEmployee;
            break;
    }

    return (
        <div className={styles.buttons}>
                    <button
                        className={styles.cancelButton}
                        onClick={(e) => {
                            e.preventDefault();
                            router.push(routes.index);
                        }}>
                        Regresar
                    </button>
                    {(service != 'Paquete') && (

                        <button
                            onClick={(e) => {
                                const url = routes.edit.replace('${id}', id);
                                e.preventDefault();
                                router.push(url);

                            }}>
                            Editar
                        </button>

                    )}
                    <button className={styles.deleteButton}
                        onClick={ (e) => {
                            e.preventDefault();
                            routes.deleteFunction(id);
                    }}>Eliminar</button>
                </div>
    )
}