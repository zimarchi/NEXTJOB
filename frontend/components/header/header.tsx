"use client"

import styles from "./header.module.css";
import Image from "next/image";
import Logo from "../logo/logo";
import { useAuth } from "../../context/userContext";
import AuthModal from "@/components/modals/authModal/authModal";
import MonCompteModal from "../modals/monCompteModal/monCompteModal";
import EmailConfirmationRequestModal from "../modals/emailConfirmationRequestModal";
import {MODAL_STATES} from "@/constants/modalStates"

import Link from "next/link";

export default function Header() {
  
  // Etats via useContext
  const {toggleModals, currentUser, firebaseUser, modalState } = useAuth ()

  return (
    <header>
      { modalState === MODAL_STATES.MON_COMPTE && <MonCompteModal /> }
      { [MODAL_STATES.SIGN_UP, MODAL_STATES.SIGN_IN, MODAL_STATES.PASSWORD].includes (modalState) && <AuthModal /> }
      { modalState === MODAL_STATES.EMAIL_CONFIRMATION.SIGN_UP && <EmailConfirmationRequestModal title = "🎉 Votre compte est créé !"/>}
      { modalState === MODAL_STATES.EMAIL_CONFIRMATION.UPDATE && <EmailConfirmationRequestModal title = "Votre adresse e-mail a été modifiée..."/>}

      <nav className={styles.nav} aria-label = "Navigation principale">
        <Link 
          onClick={()=> toggleModals(MODAL_STATES.CLOSE)}
          href="/"
          className={styles.logo}
        >
          <Logo logoWidth={100}/>
        </Link>
        <button 
          className={styles.monCompteButton}
          onClick={()=> {
            if (!firebaseUser || !currentUser) { 
              toggleModals(MODAL_STATES.SIGN_IN)
              return
            }
            toggleModals (MODAL_STATES.MON_COMPTE)
          }}
        >
          <span> {(firebaseUser && currentUser?.firstname) || "Se connecter"} </span>
          <Image
            src={currentUser?.user_photo_url || "/defaultAvatar.svg"}
            alt={firebaseUser ? "Photo de profil" : "Icône utilisateur par défaut"}
            width={35}
            height={35}
            className="profilePhoto"
          />
        </button>
      </nav>
    </header>
  );
}
