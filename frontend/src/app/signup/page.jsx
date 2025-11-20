"use client";
import SignUpForm from "./signup_form/SignUpForm";
import styles from "./Sign-Up.module.css";

export default function SignUp() {
  return (
    <div className={styles.layout}>
      <div className={styles.hero}></div>
      <div className={styles.formContainer}>
        <main className={styles.main}>
          <h1>Barbershop</h1>
          <SignUpForm></SignUpForm>
          <div className={styles.signInContainer}>
            <span>o</span>
            <a href="/signin">inicia sesión</a>
          </div>
        </main>
      </div>
    </div>
  );
}
