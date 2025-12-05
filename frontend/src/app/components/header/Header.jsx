import Link from "next/link";
import styles from "./Header.module.css";

export default function Header({
  isSidebarVisible,
  onSidebarToggle,
  title = "Dashboard",
}) {
  return (
    <header className={styles.header}>
      <div className={styles.headerContainer}>
        <div className={styles.titleContainer}>
          <button
            className={styles.sidebarButton}
            onClick={onSidebarToggle}
            aria-label="Toggle sidebar"
            aria-expanded={isSidebarVisible}
          ></button>
          <h1>{title}</h1>
        </div>
        <div className={styles.profileContainer}>
          <ul className={styles.dropdown}>
            <li>
              <figure>
                <img src="/circle-user-solid-full.svg" alt="" />
              </figure>
              <ul>
                <li>
                  <Link href="/account">
                    <div className={styles.iconContainer}>
                      <img
                        src="/icons/gear-solid-full.svg"
                        alt="sign-out-icon"
                      />
                    </div>
                    Configuración de la cuenta
                  </Link>
                </li>
                <li>
                  <Link href="/">
                    <div className={styles.iconContainer}>
                      <img
                        src="/icons/arrow-right-from-bracket-solid-full.svg"
                        alt="sign-out-icon"
                      />
                    </div>
                    Cerrar sesión
                  </Link>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
}
