import styles from "./Customer-Header.module.css";

export default function CustomerHeader({ title }) {
  return (
    <header className={styles.header}>
      <h1>{title}</h1>
      <figure>
        <img src="/icons/Sagoz_Icon.png" alt="Sagoz Logo" />
      </figure>
    </header>
  );
}
