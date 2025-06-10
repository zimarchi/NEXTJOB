"use client"

import styles from "./header.module.css";
import Image from "next/image";
import Logo from "../logo/logo";
import { useAuth } from "../../context/userContext";
import AuthModal from "@/components/modales/authModal/authModal";
import MonCompteModal from "../modales/monCompteModal/monCompteModal";
import UserUpdateModale from "../modales/userUpdateModal/userUpdateModal";
import {MODAL_STATES} from "@/constants/modalStates"

import Link from "next/link";

export default function Header() {
  
  // Etats via useContext
  const {toggleModals, currentUser, firebaseUser, modalState} = useAuth ()

  return (
    <header>
      { modalState === MODAL_STATES.MON_COMPTE && <MonCompteModal /> }
      { [MODAL_STATES.SIGN_UP, MODAL_STATES.SIGN_IN, MODAL_STATES.PASSWORD].includes (modalState) && <AuthModal /> }
      { [MODAL_STATES.UPDATE.USER_BIRTH_DATE, MODAL_STATES.UPDATE.USER_FULL_NAME, MODAL_STATES.UPDATE.USER_PHOTO].includes (modalState) && < UserUpdateModale /> }
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
            src={currentUser?.photo_url || "/defaultAvatar.svg"}
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
