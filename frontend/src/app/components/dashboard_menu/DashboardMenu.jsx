import { useState } from "react";
import Appointment from "../appointment/Appointment";
import styles from "./Dashboard-Menu.module.css";

export default function DashboardMenu() {
  const [menuSelected, setMenuSelected] = useState("appointments");

  function handleClick(e, menu) {
    e.preventDefault();
    setMenuSelected(menu);
  }

  return (
    <div className={styles.layout}>
      <nav className={styles.sidebar}>
        <ul>
          <li>
            <a href="" onClick={(e) => handleClick(e, "appointments")}>
              Citas
            </a>
          </li>
          <li>
            <a href="" onClick={(e) => handleClick(e, "services")}>
              Servicios
            </a>
          </li>
          <li>
            <a href="" onClick={(e) => handleClick(e, "bundles")}>
              Paquetes
            </a>
          </li>
          <li>
            <a href="" onClick={(e) => handleClick(e, "staff")}>
              Empleados
            </a>
          </li>
        </ul>
      </nav>
      {menuSelected === "appointments" && <Appointment></Appointment>}
    </div>
  );
}
