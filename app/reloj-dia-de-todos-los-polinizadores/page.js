import RelojClient from "./RelojClient";
import { Fraunces } from "next/font/google";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
});

export const metadata = {
  title: "Reloj del Dia de Todos los Polinizadores",
  description:
    "Cuenta regresiva viva hacia el 21 de junio con transicion automatica al anuncio oficial del Dia de Todos los Polinizadores.",
  alternates: {
    canonical: "https://www.aquamundi.org/reloj-dia-de-todos-los-polinizadores",
  },
};

export default function RelojDiaPolinizadoresPage() {
  return (
    <div className={fraunces.variable}>
      <RelojClient />
    </div>
  );
}
