import status from "./styles.module.css";

export const Status = ({ state , type}) => {
  let stateClass = "";
  let text;

  if(type == 'appointment'){
    if(state == 'completed'){
      stateClass = status.activo;
      text = "Finalizada";
    } else if(state == 'cancelled'){
      stateClass = status.inactivo;
      text = "Cancelado";
    } else if(state == 'confirmed'){
      stateClass = status.confirmado;
      text = "Confirmada";
    } else if(state == 'pending'){
      stateClass = status.pendiente;
      text = "Pendiente";
    }
  }else{
    if(state == 'active'){
      stateClass = status.activo;
      text = "Activo";
    }else{
      stateClass = status.inactivo;
      text = "Inactivo";
    }


  }

  return (
    <span className={`${status.badge} ${stateClass}`}>
      <span className={status.dot}></span>
      {text}
    </span>
  );
};
