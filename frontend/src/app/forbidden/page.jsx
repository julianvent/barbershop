"use server";
import Layout from "../components/base_layout/Layout";
import { isAdmin } from "../utils/requestBuilder";
import styles from "../admin/Main.module.css"

export default async function forbidden(){
  const isAdm = await isAdmin();
  return (
    <Layout isAdmin={isAdm}>
        <title>SG BarberShop</title>
        <article className={styles.layoutShow}>
          <div>
            <h2>No tienes permiso para ver esta pagina</h2>
            <p>Contacta al administrador para cualquier aclaracion</p>
            <ul>
              <li><a href="/admin/appointments"><strong>Panel principal</strong></a></li>
            </ul>

          </div>
        </article>

    </Layout>
  );
}