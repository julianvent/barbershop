import { Poppins } from "next/font/google";
import "./globals.css";

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
    <html lang="en">
      <body className={`${poppinsSans.variable}`}>
        {children}
      </body>
    </html>
  );
}
