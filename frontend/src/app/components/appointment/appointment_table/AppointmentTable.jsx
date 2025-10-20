import styles from "./Appointment-Table.module.css";
import { useRouter } from "next/navigation";

export default function AppointmentTable({ entries }) {
  const router = useRouter();

  async function handleClick(appointmentId) {
    router.push(`dashboard/appointment/${appointmentId}/update`);
  }

  entries.map((e) => {
    e.fecha = e.fecha_hora_cita ? e.fecha_hora_cita.split("T")[0] : "";
    const [year, month, day] = e.fecha.split("-");
    const formato = `${day}/${month}/${year}`;
    e.fecha = formato;
    e.hora = e.fecha_hora_cita
      ? e.fecha_hora_cita.split("T")[1].substring(0, 5)
      : "";
    e.estado = e.estado.charAt(0).toUpperCase() + e.estado.slice(1);
  });

  if (entries.length == 0) return <p>No existen citas programadas...</p>;

  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th scope="col">Fecha</th>
          <th scope="col">Hora</th>
          <th scope="col">Cliente</th>
          <th scope="col" className={styles.hidden}>
            Teléfono
          </th>
          <th scope="col">Estado</th>
        </tr>
      </thead>
      <tbody>
        {entries.map((e) => (
          <tr key={e.id_cita}>
            <td>{e.fecha}</td>
            <td>{e.hora}</td>
            <td>{e.nombre_cliente}</td>
            <td className={styles.hidden}>{e.numero_telefonico_cliente}</td>
            <td>{e.estado}</td>
            <td className={styles.buttonsCell}>
              <ul className={styles.dropdown}>
                <li>
                  <button
                    className={styles.more}
                    onClick={() => handleClick(e.id_cita)}
                  >
                    <img
                      src="/ellipsis-solid-full.svg"
                      alt="more"
                      className={styles.icon}
                    />
                  </button>
                  <ul>
                    <li>
                      <a href={`dashboard/appointment/${e.id_cita}`}>Visualizar</a>
                    </li>
                    <br />
                    <li>
                      <a href={`dashboard/appointment/${e.id_cita}/update`}>Modificar</a>
                    </li>
                  </ul>
                </li>
              </ul>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
