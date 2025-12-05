"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import './style/styles.css';

export default function ExpiredModal() {
  const router = useRouter();

  useEffect(() => {

    const timeout = setTimeout(() => {
      router.push("/");
    }, 3000);

    const handleKeyDown = (e) => {
      if (e.key === "Tab") {
        e.preventDefault();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      clearTimeout(timeout);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [router]);

  return (
    <div aria-hidden='true' className="modal-backdrop">
      <article aria-label="Modal Informativo" className="modal-container fade-in">
        <header className="modal-header">
          <h2>Sesión expirada</h2>
        </header>
        <main className="modal-content">
          <p>Tu sesión ha expirado. Redirigiendo a la ventana de Inicio de Sesión.</p>
        </main>
        <footer className="modal-footer">
          <button aria-label="Confirmar redireccion" autoFocus onClick={() => router.push('/')}>Confirmar</button>
        </footer>
      </article>
    </div>
  );
}