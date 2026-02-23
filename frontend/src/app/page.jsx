
import styles from './home/styles.module.css'
import Button from './home/Button'
export default function Page() {


  return (
    <div className={styles.layout}>
      <title>SG Barbershop</title>
      
      <header className={styles.header}>
        <h1>SAGOZ Barberhop</h1>
        <figure>
          <img src="/icons/Sagoz_Icon.png" alt="Sagoz Logo" />
        </figure>

        <div className={styles.buttonContainer}>
          <figure>
            <a href="/signin">
              <img src="/circle-user-solid-full.svg" alt="Menú de usuario" />
            </a>
          </figure>
        </div>
      </header>

      {/* <CustomerHeader title={'xd'}/> Pendiente */}
      <main className={styles.scrollableContent}>

          
        <article className={styles.content}>
          <h1>SAGOZ Barbershop</h1>
        <article>
          <div className={styles.columns}>
            <div>
              <h2>Sobre nosotros</h2>
              
              <p>
                En SAGOZ, no solo cortamos cabello, diseñamos tu mejor versión. Sabemos que buscas un look impecable sin complicaciones, por eso nos enfocamos en tres pilares:
              </p>
              
              <ul className={styles.list}>
                <li>
                  Maestría en el Corte: Desde los clásicos que nunca fallan hasta las tendencias más modernas.
                </li>

                <li>
                  Perfilado de Barba: Precisión absoluta para que tu barba hable bien de ti.
                </li>
  
                <li>
                  Atención de Primera: Aquí no eres un turno más. Te recibimos en un ambiente relajado donde el protagonista eres tú.
                </li>
              </ul>
            </div>

            <div>
              <figure>
                <img className={styles.imageFit} src="/hero.png" alt="Image of Sagoz Service" />
              </figure>
            </div>
            
          </div>
        </article>

        <div className={styles.centerMessage}>
          <p>
            Lo mejor de dos mundos "Calidad premium a precios que sí hacen sentido." Creemos que lucir bien no debería ser un lujo inalcanzable. 
            En SAGOZ, obtienes un servicio de alta gama con precios accesibles que cuidan tu bolsillo.
          </p>
          <div>
            <Button/>
          </div>
        </div>

        <article>
          <div className={styles.columns}>
            <div>
              <figure>
                <img className={styles.imageFit} src="/hero.png" alt="Sagoz Service" />
              </figure>
            </div>
            <div>
              <h2> Preguntas Frecuentes </h2>
              <ol className={styles.list}>
                <li>
                  <strong>¿Necesito cita previa?</strong> 
                  <p>Aceptamos clientes sin cita, pero agendar te asegura cero esperas.</p>
                </li>

                <li>
                  <strong> ¿Qué métodos de pago aceptan? </strong> 
                  <p>Efectivo, tarjetas de crédito/débito y transferencia.</p>
                </li>

                <li>
                  <strong>¿Tienen estacionamiento?</strong>  
                  <p>Sí, contamos con espacio frente al local.</p>
                </li>
              </ol>
            </div>
          </div>
        </article>
        
        </article>




      <footer className={styles.footer}>
        <p>Sagoz Barbershop © 2026</p>
        
        <div className={styles.socials}>
          <div>
            <ul>
              <li>
                <a href={ process.env.FACEBOOK_URL ?? "https://www.facebook.com/profile.php"}>
                  <img src="/icons/social-media/facebook.svg" alt="facebook image" />
                </a>
              </li>

              <li>
                <a href={process.env.INSTAGRAM_URL ?? "https://www.instagram.com/"}>
                  <img src="/icons/social-media/instagram.svg" alt="instagram image" />
                </a>
              </li>

              <li>
                <a href={process.env.WHATSAPP_URL ?? "https://wa.me"}>
                  <img src="/icons/social-media/whatsapp.svg" alt="whatsapp image" />
                </a>
              </li>

              <li>
                <a href={"mailto:" + process.env.MAILTO}>
                  <img src="/icons/social-media/mail.svg" alt="image of mail image" />
                </a>
              </li>
            </ul>
          </div>
        </div>
      </footer>
      </main>

    </div>
  )
}
