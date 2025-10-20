import styles from "./Header.module.css";

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.headerContainer}>
        <h1>Barbershop</h1>
        <ul className={styles.dropdown}>
          <li>
            <figure>
              <img src="/circle-user-solid-full.svg" alt="" />
            </figure>
            <ul>
              <li>
                <a href="/login">Cerrar sesión</a>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </header>
  );
}
