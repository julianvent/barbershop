"use client";
import { useRouter } from "next/navigation";
import styles from "./styles.module.css";

export function ActionButton({ id, actions }) {
  const router = useRouter();

  const handleClick = (action) => {
    const finalRoute = action.route.replace("${id}", id);
    router.push(finalRoute);
  };

  const edit = actions.find((u) => u.name === "edit");
  const see = actions.find((u) => u.name === "see");

  return (
    <div className={styles.buttons}>
      {edit && (
        <button onClick={() => handleClick(edit)}>
          <div className={styles.iconContainer}>
            <img src="/icons/pen-to-square-solid-full.svg" alt="Edit" />
          </div>
        </button>
      )}

      {see && (
        <button onClick={() => handleClick(see)}>
          <div className={styles.iconContainer}>
            <img src="/icons/circle-info-solid-full.svg" alt="View details" />
          </div>
        </button>
      )}
    </div>
  );
}
