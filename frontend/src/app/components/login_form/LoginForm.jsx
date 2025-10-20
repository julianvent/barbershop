"use client";

import styles from "./Login-Form.module.css";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function LoginForm() {
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [quote, setQuote] = useState();
  const [isRegistering, setIsRegistering] = useState(false);
  const [menuSelected, setMenuSelected] = useState("login");

  useEffect(() => {
    fetch("/api/quotes")
      .then((res) => res.json())
      .then((res) => setQuote(res.text))
      .catch(console.error);
  }, [setQuote]);
  const router = useRouter();

  async function handleLogin(e) {
    e.preventDefault();
    setIsLoggingIn(true);

    const form = new FormData(e.currentTarget);
    const correo_electronico = form.get("email");
    const contrasena = form.get("password");

    try {
      setIsLoggingIn(true);
      const res = await fetch("/api/accounts/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          correo_electronico,
          contrasena,
        }),
      });
      if (!res.ok) throw new Error("Error");
      setIsLoggingIn(false);
      router.push("/dashboard");
    } catch (err) {}
  }

  async function handleRegister(e) {
    e.preventDefault();

    const form = new FormData(e.currentTarget);
    const nombre_completo = form.get("name")?.toString() ?? "";
    const correo_electronico = form.get("email")?.toString() ?? "";
    const contrasena = form.get("password")?.toString() ?? "";
    const rol = "recepcionista";

    try {
      setIsRegistering(true);
      const res = await fetch("/api/accounts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre_completo,
          correo_electronico,
          contrasena,
          rol,
        }),
      });
      if (!res.ok) throw new Error("Error");
      setIsRegistering(false);
      setMenuSelected("login");
    } catch (err) {}
  }

  return (
    <div className={styles.formContainer}>
      <main>
        <h1>Barbershop</h1>
        <p className={styles.quote}>{quote || "Cargando frase..."}</p>
        {menuSelected === "login" && (
          <form onSubmit={handleLogin}>
            <div className={styles.fieldsContainer}>
              <div className={styles.field}>
                <label htmlFor="email">Correo</label>
                <input type="email" name="email" />
              </div>
              <div className={styles.field}>
                <label htmlFor="password">Contraseña</label>
                <input type="password" name="password" />
              </div>
              <div className={styles.buttonsContainer}>
                <button type="submit" disabled={isLoggingIn}>
                  Iniciar sesión
                </button>
                <button
                  className={styles.alternateButton}
                  onClick={() => {
                    setMenuSelected("register");
                  }}
                >
                  ¿No cuentas con una cuenta? Regístrate ahora
                </button>
              </div>
            </div>
          </form>
        )}
        {menuSelected === "register" && (
          <form onSubmit={handleRegister}>
            <div className={styles.fieldsContainer}>
              <div className={styles.field}>
                <label htmlFor="name">Nombre</label>
                <input type="text" name="name" />
              </div>
              <div className={styles.field}>
                <label htmlFor="email">Correo</label>
                <input type="email" name="email" />
              </div>
              <div className={styles.field}>
                <label htmlFor="password">Contraseña</label>
                <input type="password" name="password" />
              </div>
              <div className={styles.buttonsContainer}>
                <button type="submit" disabled={isRegistering}>
                  Crear cuenta
                </button>
                <button
                  className={styles.alternateButton}
                  onClick={() => {
                    setMenuSelected("login");
                  }}
                >
                  ¿Ya tienes una cuenta? Inicia sesión
                </button>
              </div>
            </div>
          </form>
        )}
      </main>
    </div>
  );
}
