"use client";

import styles from "./Login-Form.module.css";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginForm() {
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    setIsLoggingIn(true);
    await new Promise((res) => setTimeout(res, 700));
    router.push("/dashboard");
  }

  return (
    <div className={styles.formContainer}>
      <main>
        <h1>Barbershop</h1>
        <form onSubmit={handleSubmit}>
          <div className={styles.fieldsContainer}>
            <div className={styles.field}>
              <label htmlFor="email">Correo</label>
              <input type="email" name="email" />
            </div>
            <div className={styles.field}>
              <label htmlFor="password">Contraseña</label>
              <input type="password" name="password" />
            </div>
            <button type="submit" disabled={isLoggingIn}>
              Iniciar sesión
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
