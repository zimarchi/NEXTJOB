import { UPDATE_USER_PHOTO_INPUTS } from "@/constants/formsInfos";
import { MODAL_STATES } from "@/constants/modalStates";
import { useState } from "react";
import { useAuth } from "@/context/userContext";
import Fieldset from "@/components/forms/formFieldset";
import { updateUserPhoto } from "@/helpers/update/updateUserPhoto";
import { uploadUserPhoto } from "@/helpers/upload/uploadUserPhoto";
import { deleteUserPhoto } from "@/helpers/delete/deleteUserPhoto";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function UserPhotoUpdateModale() {
  
  const router = useRouter();

  // Etats via useContext
  const {loading, toggleModals, updateCurrentUser, firebaseUser, currentUser, modalState} = useAuth ()
 
// Gestion de l'upload de la photo :
  const [photoPreviewURL, setPhotoPreviewUrl] = useState <string | null> (null) 
  const [photoFile, setPhotoFile] = useState <File| null> (null)

  // Message d'erreur en bas du formulaire :
  const [formValidationMessage, setFormValidationMessage] = useState("")

  // Gestion de la validation du formulaire :
  const handleUpdateUserPhoto = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!photoFile && modalState === MODAL_STATES.UPDATE.USER_PHOTO) {
      setFormValidationMessage("Veuillez sélectionner une photo.");
      return false;
    }
    // Vérification de l'état de la connexion :
    if (firebaseUser) {
      // Suppression de la photo :
      if (modalState === MODAL_STATES.DELETE.USER_PHOTO && currentUser!.user_photo_url) {
        const deleteSuccess = await deleteUserPhoto (currentUser!.user_photo_url)
        if (deleteSuccess) {
          const photoUpdateSuccess = await updateUserPhoto (null)
          toggleModals(MODAL_STATES.CLOSE)
          console.log("user mis à jour", photoUpdateSuccess)
        }
        return
      }

      // Upload de la nouvelle photo dans le storage Supabase et récupération de l'url de la photo :
      if (modalState === MODAL_STATES.UPDATE.USER_PHOTO) {
        const user_photo_url = await uploadUserPhoto(photoFile!, firebaseUser.uid, currentUser!.user_photo_url)
        if (!user_photo_url) {
          setFormValidationMessage("L'upload de l'image a échoué.");
          return false;
        }
        // Update de l'utilisateur dans la bdd Supabase :
        const photoUpdateSuccess = await updateUserPhoto (user_photo_url)
        if (photoUpdateSuccess) {
          toggleModals(MODAL_STATES.CLOSE)
          //MAJ de currentUser :
          updateCurrentUser (photoUpdateSuccess)
        }

      }
    }
    if (!firebaseUser && !loading) {
      toggleModals(MODAL_STATES.CLOSE)
      router.push("/")
    }
  }
  
// Titre de la modale :
  const getModalTitle = () => {
    switch (modalState) {
      case MODAL_STATES.UPDATE.USER_PHOTO:
        return "Mettez à jour votre photo";
      case MODAL_STATES.DELETE.USER_PHOTO:
        return "Supprimez votre photo";
    }
  }

  return (
    <div className="modalPage modalPageColor" onClick={() => {
      toggleModals(MODAL_STATES.CLOSE)
      if (!firebaseUser) {
        updateCurrentUser(null)
      }
    }}
    > 
      <section className="modal" role="dialog" aria-modal="true" aria-labelledby="update-modal-title" onClick={(e) => e.stopPropagation()}>
        <h3 id="update-modal-title">{getModalTitle()}</h3>
        { modalState === MODAL_STATES.UPDATE.USER_PHOTO ?
          <p style={{ color: "var(--submitButton-background-color)", fontSize: 14, width: "100%"}}>
          Taille maximum du fichier : 2 mo, formats acceptés : jpg, jpeg
          </p> 
          : 
          <p style = {{fontSize: 14}}>Voulez-vous vraiment supprimer cette photo ?</p>
        }
        <form
          className="userForm"
          onSubmit={handleUpdateUserPhoto} 
        >
          {modalState === MODAL_STATES.UPDATE.USER_PHOTO &&
          <Fieldset
                legend = "Téléversez votre photo (taille max. : 2 Mo, formats acceptés : jpg, jpeg, png"
                infos = { UPDATE_USER_PHOTO_INPUTS }
                fieldsetStyle = "textFieldset"
                // Récupération des infos de la photo uploadée en front
                setFile = {setPhotoFile}
                setURL = {setPhotoPreviewUrl}
          />
          }
          <Image
            src={photoPreviewURL || currentUser?.user_photo_url || "/defaultAvatar.svg"}
            alt="Photo profil"
            width={120}
            height={120}
            className="profilePhoto"
            priority
          />
          <div className="buttonsLine">
            <button className="resetButton" type="reset"
              onClick={() => {
                if (modalState === MODAL_STATES.UPDATE.USER_PHOTO) toggleModals (MODAL_STATES.CLOSE)
                if (modalState === MODAL_STATES.DELETE.USER_PHOTO) toggleModals (MODAL_STATES.UPDATE.USER_PHOTO)
                }}
            >{modalState === MODAL_STATES.UPDATE.USER_PHOTO ? "Annuler" : "Non"}
            </button>
            <button className="submitButton" type="submit">
              {modalState === MODAL_STATES.UPDATE.USER_PHOTO ? "Enregister" : "Oui"}
            </button>
          </div>
          { formValidationMessage.length > 0 &&
          <span style={{ color: "red", fontSize: 14, width: "100%", display: "block" , height: "15px"}}>
            {formValidationMessage}
          </span>
          }
        </form>
        {modalState === MODAL_STATES.UPDATE.USER_PHOTO && currentUser?.user_photo_url &&
        <button  
          className = "fakeButton" 
          style={{width: "100%", paddingBottom: "10px"}}
          onClick={() => { 
            toggleModals(MODAL_STATES.DELETE.USER_PHOTO)
          }}
        >
          Supprimer ma photo
        </button>
        }
      </section>
    </div>
  )
}
