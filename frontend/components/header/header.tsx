"use client"

import styles from "./header.module.css";
import Image from "next/image";
import Logo from "../logo/logo";
import { useAuth } from "@/lib/context/userContext";
import AuthModal from "@/components/modales/authModal/authModal";
import MonCompteModal from "../modales/monCompteModal/monCompteModal";
import Link from "next/link";

export default function Header() {
  
  // Etats via useContext
  const {modalState, toggleModals, currentUser, firebaseUser} = useAuth ()

  return (
    <>
      { modalState === "monCompte" && <MonCompteModal /> }
      { ["signup", "signin", "password"].includes (modalState) && <AuthModal /> }
      <nav className={styles.main}>
        <Link 
          onClick={()=> toggleModals("close")}
          href="/"
          className={styles.logo}
        >
          <Logo photoSize={40} fontSize={"18px"}/>
        </Link>
        <a 
          className={styles.monCompte} 
          onClick={()=> {
            if (!firebaseUser) { 
              toggleModals("signin") 
              return 
            }
            toggleModals ("monCompte")
          }}
        >
          <span> {(firebaseUser && currentUser?.firstname) || "Se connecter"} </span>
          <Image
            src={currentUser?.photo_url || "/defaultAvatar.svg"}
            alt="Photo profil"
            width={35}
            height={35}
            className="profilePhoto"
          />
        </a>
      </nav>
    </>
  );
}
