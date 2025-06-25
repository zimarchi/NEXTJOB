import { MODAL_STATES } from "@/constants/modalStates";
import { useState } from "react";
import { useAuth } from "@/context/userContext";
import { updateUserPhoto } from "@/helpers/update/updateUserPhoto";
import { deleteUserPhoto } from "@/helpers/delete/deleteUserPhoto";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function UserPhotoDeleteModal() {
  
  const router = useRouter();

  // Etats via useContext
  const {loading, toggleModals, updateCurrentUser, firebaseUser, currentUser} = useAuth ()

  // Etat pour délai soumission :
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Message d'erreur en bas du formulaire :
  const [formErrorMessage, setFormErrorMessage] = useState("")

  // Gestion de la validation du formulaire :
  const handleDeleteUserPhoto = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    // Vérification de l'état de la connexion :
    if (firebaseUser) {
      // Suppression de la photo du storage Supabase puis mise à jour du lien de la photo dans la bdd Supabase :
      const deleteSuccessFromStorage = await deleteUserPhoto (currentUser!.user_photo_url!)
      if (!deleteSuccessFromStorage) {
        setFormErrorMessage("Erreur lors de la suppression de la photo.")
        setIsSubmitting(false)
        return
      }
      // Update de l'utilisateur dans la bdd Supabase :
      await updateUserPhoto (null)
      toggleModals(MODAL_STATES.CLOSE)
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
      <section className="modal" role="dialog" aria-modal="true" aria-labelledby="delete-modal-title" onClick={(e) => e.stopPropagation()}>
        <h3 id="delete-modal-title">Supprimez votre photo</h3>
        <p className="modalText">Voulez-vous vraiment supprimer votre photo de profil ?</p>
        <form
          className="userForm"
          onSubmit={handleDeleteUserPhoto} 
        >
          <Image
            src={currentUser?.user_photo_url || "/defaultAvatar.svg"}
            alt="Photo profil"
            width={120}
            height={120}
            className="profilePhoto"
            priority
          />
          <div className="buttonsLine">
            <button className="resetButton" type="reset" onClick={() => toggleModals (MODAL_STATES.CLOSE)}>
              Non
            </button>
            <button className={`submitButton ${isSubmitting ? "disabledButton" : "dangerButtonBackgroundColor"}`} disabled = {isSubmitting} type="submit">
              Oui
            </button>
          </div>
          { formErrorMessage.length > 0 &&
          <span className="errorMessages">
            {formErrorMessage}
          </span>
          }
        </form>
      </section>
    </div>
  )
}
