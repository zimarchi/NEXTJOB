"use client"

import styles from "./page.module.css"
import { useAuth } from "@/context/userContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Image from "next/image";
import UserRoleLabel from "@/components/usersRolesLabels/userRoleLabel";
import MonCompteForm from "@/components/forms/monCompteForm/monCompteForm";
import {MODAL_STATES} from "@/constants/modalStates";
import UserInfosUpdateModal from "@/components/modals/userUpdateModals/userInfosUpdateModal";
import UserPhotoUpdateModal from "@/components/modals/userUpdateModals/userPhotoUpdateModal";


export default function MonCompte() {

  // Etats via useContext
  const {currentUser, firebaseUser, loading, formattedBirthDateLong, toggleModals, modalState} = useAuth ()

  const router = useRouter();

  useEffect(() => {
    // Redirection vers la page d'accueil si pas de user connecté :
    if (!firebaseUser && !loading) {
      router.push("/")
    }
  }, [firebaseUser, loading, router]);
  
  // Pour éviter le mismatch entre rendu coté serveur et coté client :
  if (!firebaseUser || !currentUser) {
    return null
  } 
  
  return (
    <>
      { [MODAL_STATES.UPDATE.USER_BIRTH_DATE, MODAL_STATES.UPDATE.USER_FULL_NAME, MODAL_STATES.UPDATE.USER_EMAIL].includes (modalState) && < UserInfosUpdateModal /> }
      { [MODAL_STATES.UPDATE.USER_PHOTO, MODAL_STATES.DELETE.USER_PHOTO].includes (modalState)  && < UserPhotoUpdateModal /> }

      <section className={styles.monCompte}>
        <header className={styles.title}>
          <h1>Mon compte </h1>
          <UserRoleLabel label = {currentUser?.role || "null"} fontSize = "22px" />
        </header>
        <article className={styles.form}>
          <figure className={styles.photoContainer}>
            <Image
              src={currentUser?.user_photo_url || "/defaultAvatar.svg"}
              alt="Photo profil"
              width={160}
              height={160}
              className="profilePhoto"
              priority
            />
            <button className = "fakeButton" onClick={()=> toggleModals(MODAL_STATES.UPDATE.USER_PHOTO)} >Changez votre photo</button>
          </figure>
          <MonCompteForm
            infos = {[
              {
                label: "Nom complet",
                value: currentUser?.firstname + " " + currentUser?.lastname || "null",
                modal: MODAL_STATES.UPDATE.USER_FULL_NAME,
              },
              {
                label: "Adresse email",
                value: currentUser?.email || "Non renseignée",
                modal: MODAL_STATES.UPDATE.USER_EMAIL,
              },
              {
                label: "Date de naissance",
                value: formattedBirthDateLong || "Non renseignée",
                modal: MODAL_STATES.UPDATE.USER_BIRTH_DATE,
              },
            ]}
          />            
        </article>
      </section>
    </>
  )
}