import { Poppins } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import "@/styles/micromodal.css";

const poppinsSans = Poppins({
  weight: "400",
  variable: "--font-poppins-sans",
  subsets: ["latin"],
});

export const metadata = {
  title: "SG Barbershop",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className={`${poppinsSans.variable}`}>
        <div className={`mainLayout`}>{children}</div>
        <div role="notifier" aria-label="Notificaciones">
          <Toaster position="bottom-right" reverseOrder={false} />
        </div>
      </body>
    </html>
  );
}
