import SignInForm from "./signin_form/SignInForm";
import styles from "./Sign-In.module.css";

export default function SignIn() {
  return (
    <div className={styles.layout}>
      <div className={styles.hero}></div>
      <div className={styles.formContainer}>
        <main className={styles.main}>
          <h1>Barbershop</h1>
          <SignInForm></SignInForm>
        </main>
      </div>
    </div>
  );
}
