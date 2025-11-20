import styles from "./Table.module.css";
import { useRouter } from "next/navigation";

export default function Table({ entries, fields, actions }) {
  const router = useRouter();
  return (
    <table className={styles.table}>
      <thead>
        <tr>
          {fields.map((e) => (
            <th key={e.name} scope="col">
              {e.header}
            </th>
          ))}
          <th scope="col" className={styles.actionsColumn}></th>
        </tr>
      </thead>
      <tbody>
        {entries.map((entry) => (
          <tr key={entry.id}>
            {fields.map((field) => (
              <td key={field.name}>{entry[field.name]}</td>
            ))}

            {actions != null ? (
              <td className={styles.actionsCell}>
                <ul className={styles.actions}>
                  <li>
                    <button className={styles.actionsButton}>
                      <img
                        src="/ellipsis-solid-full.svg"
                        alt="more"
                        className={styles.icon}
                      />
                    </button>
                    <ul className={styles.actionsMenu}>
                      {actions.map((action) => (
                        <li key={action.text}>
                          <a
                            href="#"
                            onClick={() =>
                              router.push(action.base_url + entry.id)
                            }
                          >
                            {action.text}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </li>
                </ul>
              </td>
            ) : null}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
