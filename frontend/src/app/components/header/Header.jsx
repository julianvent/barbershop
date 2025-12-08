import styles from "./Header.module.css";
import { Dropdown } from "./dropdown/Dropdown";

export default function Header({
  isSidebarVisible,
  onSidebarToggle,
  title = "Panel principal",
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
        <figure className={styles.logo}>
          <img src="/icons/Sagoz_Icon.png" alt="Sagoz Logo" />
        </figure>
        <div className={styles.profileContainer}>
          <ul className={styles.dropdown}>
            <Dropdown></Dropdown>
          </ul>
        </div>
      </div>
    </header>
  );
}
