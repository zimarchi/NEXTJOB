"use client"

import styles from "./page.module.css"
import { useAuth } from "@/lib/context/userContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Image from "next/image";
import UserUpdateModale from "@/components/modales/updateModal/userUpdateModal";
import CategorieLabel from "@/components/categorieLabel/categorieLabel";
import MonCompteForm from "@/components/formsInputs/monCompteForm/monCompteForm";

export default function MonCompte() {

  // Etats via useContext
  const {currentUser, firebaseUser, modalState, loading, formattedBirthDateLong} = useAuth ()

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
      {modalState?.includes("update") && 
      < UserUpdateModale />}
      <div className={styles.main}>
        <div className={styles.blanck}>
          <div className={styles.title}>
            <h1>Mon compte </h1>
            <CategorieLabel label = {currentUser?.categorie || "null"} fontSize = "22px" />
          </div>
          <div className={styles.form}>
            <div className={styles.photoContainer}>
              <Image
                src={currentUser?.photo_url || "/defaultAvatar.svg"}
                alt="Photo profil"
                width={160}
                height={160}
                className="profilePhoto"
                priority
              />
              <button className = "fakeButton" onClick={()=> console.log("modif photo")} >Changez votre photo</button>
            </div>
            <MonCompteForm
              infos = {[
                {
                  label: "Nom complet",
                  value: currentUser?.firstname + " " + currentUser?.lastname || "null",
                  modal: "updateFullName",
                },
                {
                  label: "Date de naissance",
                  value: formattedBirthDateLong || "null",
                  modal: "updateBirthDate",
                },
              ]}
            />            
          </div>
        </div>
      </div>
    </>
  )
}