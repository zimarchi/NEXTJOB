"use client"

import styles from "./page.module.css"
import { useAuth } from "@/lib/context/userContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import { formatDate } from "@/lib/modules/dateFormatting/formatDate";
import ProfileUpdateModale from "@/components/modales/updateModale/profileUpdateModale";
import CategorieLabel from "@/components/categorieLabel/categorieLabel";
import HTMLInputElementFromUpdateForm from "@/components/formsInputs/updateFormInputs";

export default function MonCompte() {

  // Etats via useContext
  const {currentUser, firebaseUser, modalState, loading} = useAuth ()
  const [formattedDate, setFormattedDate] = useState ("")

  const router = useRouter();

  useEffect(() => {
    // Redirection vers la page d'accueil si pas de user connecté :
    if (!firebaseUser && !loading) {
      router.push("/")
    }
    if (currentUser && !loading) {
      // Formatage date de naissance :
      const date = formatDate(currentUser.birth_date)
      setFormattedDate(date)
    }
  }, [firebaseUser, loading, router, currentUser]);
  
  // Pour éviter le mismatch entre rendu coté serveur et coté client :
  if (!firebaseUser || !currentUser) {
    return null
  } 
  
  return (
    <>
      {modalState === "updateFullName" &&
      < ProfileUpdateModale />}

      <div className={styles.main}>
        <div className={styles.blanck}>
          <div className={styles.title}>
            <h1>Mon compte </h1>
            <CategorieLabel label = {currentUser?.categorie} fontSize = "22px" />
          </div>
          <div className={styles.form}>
            <div className={styles.photoContainer}>
              <Image
                src={currentUser?.photo_url || "/defaultAvatar.svg"}
                alt="Photo profil"
                width={160}
                height={160}
                className="profilePhoto"
                />
                <button className = "fakeButton" onClick={()=> console.log("modif photo")} >Changez votre photo</button>
            </div>
            <div className={styles.inputsContainer}>
              <HTMLInputElementFromUpdateForm label = "Nom complet" value = {currentUser?.firstname + " " + currentUser?.lastname}/>
              <HTMLInputElementFromUpdateForm label = "Date de naissance" value = {formattedDate}/>
            </div>
          </div>
        </div>
      </div>
    </>


  )
}
