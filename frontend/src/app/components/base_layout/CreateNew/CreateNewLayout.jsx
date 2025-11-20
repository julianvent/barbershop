import Header from "../../header/Header";
import styles from "./Create-New-Layout.module.css";

export default function CreateNewLayout({ headerTitle, mainTitle, children }) {
  return (
    <div className={styles.layout}>
      <Header title={headerTitle}></Header>
      <main className={styles.scrollableContent}>
        <div className={styles.titleContainer}>
          <h1>{mainTitle}</h1>
        </div>
        <div>{children}</div>
      </main>
    </div>
  );
}
