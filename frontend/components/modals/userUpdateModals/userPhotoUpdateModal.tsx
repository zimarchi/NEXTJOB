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
 
  // Etat pour délai soumission :
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Gestion de l'upload de la photo :
  const [photoPreviewURL, setPhotoPreviewUrl] = useState <string | null> (null) 
  const [photoFile, setPhotoFile] = useState <File| null> (null)

  // Message d'erreur en bas du formulaire :
  const [formErrorMessage, setFormErrorMessage] = useState("")

  // Gestion de la validation du formulaire :
  const handleUpdateUserPhoto = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    if (!photoFile) {
      setFormErrorMessage("Veuillez sélectionner une photo.");
      setIsSubmitting(false)
      return;
    }
    // Vérification de l'état de la connexion :
    if (firebaseUser) {
      // Suppression de la photo si existante du storage Supabase :
      if (currentUser?.user_photo_url) {
        const deleteSuccessFromStorage = await deleteUserPhoto (currentUser.user_photo_url)
        if (!deleteSuccessFromStorage) {
          setFormErrorMessage("Erreur lors de la suppression de la photo existante.")
          setIsSubmitting (false)
          return
        }
      }
      // Upload de la nouvelle photo dans le storage Supabase :
      const user_photo_url = await uploadUserPhoto(photoFile!, firebaseUser.uid)
      if (!user_photo_url) {
        setFormErrorMessage("L'upload de l'image a échoué.");
        setIsSubmitting(false)
        return;
      }
      // Update du lien de la photo de l'utilisateur dans la bdd Supabase :
      const photoUpdateSuccess = await updateUserPhoto (user_photo_url)
      if (photoUpdateSuccess) {
        //MAJ de currentUser :
        updateCurrentUser (photoUpdateSuccess)
        toggleModals(MODAL_STATES.CLOSE)
      }
    }
    if (!firebaseUser && !loading) {
      toggleModals(MODAL_STATES.CLOSE)
      router.push("/")
    }
    setIsSubmitting(false)
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
        <h3 id="update-modal-title">Mettez à jour votre photo</h3>
        <p className="modalText">Taille maximum du fichier : 2 mo, formats acceptés : jpg, jpeg</p>
        <form
          className="userForm"
          onSubmit={handleUpdateUserPhoto} 
        >
          <Fieldset
                legend = "Téléversez votre photo (taille max. : 2 Mo, formats acceptés : jpg, jpeg, png"
                infos = { UPDATE_USER_PHOTO_INPUTS }
                fieldsetStyle = "textFieldset"
                // Récupération des infos de la photo uploadée en front
                setFile = {setPhotoFile}
                setURL = {setPhotoPreviewUrl}
          />
          <Image
            src={photoPreviewURL || "/defaultAvatar.svg"}
            alt="Photo sélectionnée"
            width={120}
            height={120}
            className="profilePhoto"
            priority
          />
          <div className="buttonsLine">
            <button className="resetButton" type="reset" onClick={() => toggleModals (MODAL_STATES.CLOSE)}>
              Annuler
            </button>
            <button className={`submitButton ${isSubmitting ? "disabledButton" : "submitButtonBackgroundColor"}`} disabled={isSubmitting} type="submit">
              Enregister
            </button>
          </div>
          { formErrorMessage.length > 0 &&
          <span className="errorMessages">
            {formErrorMessage}
          </span>
          }
        </form>
        {modalState === MODAL_STATES.UPDATE.USER_PHOTO && currentUser?.user_photo_url &&
        <button  
          className = "fakeButton dangerColor" 
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
