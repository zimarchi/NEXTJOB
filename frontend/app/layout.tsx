import type { Metadata } from "next";
import "./globals.css";
import Header from "../components/header/header";
import Footer from "../components/footer/footer";
import { UserContextProvider } from "@/lib/context/userContext";

export const metadata: Metadata = {
  title: "NextJob",
  description: "Le meilleur choix avant d'en faire un",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr">
      <body>
        <UserContextProvider>
          <Header />
          {children}
          <Footer />
        </UserContextProvider>
      </body>
    </html> 
  );
}
