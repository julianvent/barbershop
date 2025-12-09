import Link from "next/link";
import styles from "./Sidebar.module.css";
import { forwardRef } from "react";

const Sidebar = forwardRef(({ visible }, ref) => {
  return (
    <div data-visible={visible} ref={ref} className={styles.sidebar}>
      <ul>
        <li>
          <Link href="/admin/appointments">
            <div className={styles.iconContainer}>
              <img src="/icons/calendar-check-regular-full.svg" alt="" />
            </div>
            <span>Citas</span>
          </Link>
        </li>
        <li>
          <Link href="/admin/services">
            <div className={styles.iconContainer}>
              <img src="/icons/scissors-solid-full.svg" alt="" />
            </div>
            <span>Servicios</span>
          </Link>
        </li>
        <li>
          <Link href="/admin/staff">
            <div className={styles.iconContainer}>
              <img src="/icons/users-solid-full.svg" alt="" />
            </div>
            <span>Personal</span>
          </Link>
        </li>
      </ul>
    </div>
  );
});

Sidebar.displayName = "Sidebar";
export default Sidebar;
