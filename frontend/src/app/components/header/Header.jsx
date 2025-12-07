import Link from "next/link";
import styles from "./Header.module.css";
import { logOut } from "@/app/utils/requestBuilder";
import { Dropdown } from "./dropdown/Dropdown";

export default function Header({
  isSidebarVisible,
  onSidebarToggle,
  title = "Panel Principal",
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
              <Dropdown></Dropdown>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
}
