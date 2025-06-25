import { UPDATE_USER_FULL_NAME_INPUTS, UPDATE_USER_BIRTH_DATE_INPUTS, UPDATE_USER_EMAIL_INPUTS, UPDATE_USER_ROLE_INPUTS } from "@/constants/formsInfos";
import { MODAL_STATES } from "@/constants/modalStates";
import { useState } from "react";
import { useAuth } from "@/context/userContext";
import Fieldset from "@/components/forms/formFieldset";
import { updateUserInfos } from "@/helpers/update/updateUserInfos";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase/firebase-config";


export default function UserInfosUpdateModal() {

  const router = useRouter();

  // Etats via useContext :
  const { modalState, loading, toggleModals, updateCurrentUser, firebaseUser, currentUser, formattedBirthDateShort } = useAuth()

  // Etat pour délai soumission :
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Message d'erreur en bas du formulaire :
  const [formErrorMessage, setFormErrorMessage] = useState("")

  // Gestion de la validation du formulaire :
  const handleUpdateUserInfos = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    // Vérification de l'état de la connexion :
    if (firebaseUser && currentUser) {
      // Update de l'utilisateur :
      const infosUpdateSuccess = await updateUserInfos(
        e.currentTarget,
        currentUser,
        setFormErrorMessage,
        modalState,
      )
      if (infosUpdateSuccess) {
        if (modalState === MODAL_STATES.UPDATE.USER_EMAIL) {
          toggleModals(MODAL_STATES.EMAIL_CONFIRMATION.UPDATE)
          await signOut (auth)
        } else {
          toggleModals(MODAL_STATES.CLOSE)
        }
        // MAJ de currentUser :
        updateCurrentUser(infosUpdateSuccess)
      }
    }
    if (!firebaseUser && !loading) {
      toggleModals(MODAL_STATES.CLOSE)
      router.push("/")
    }
    setIsSubmitting(false)
  }

  // Titre de la modale :
  const getModalTitle = () => {
    switch (modalState) {
      case MODAL_STATES.UPDATE.USER_FULL_NAME:
        return "Mettez à jour votre nom";
      case MODAL_STATES.UPDATE.USER_BIRTH_DATE:
        return "Mettez à jour votre date de naissance";
      case MODAL_STATES.UPDATE.USER_EMAIL:
        return "Mettez à jour votre adresse e-mail";
      case MODAL_STATES.UPDATE.USER_ROLE:
        return "Mettez à jour votre rôle";
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
        {modalState === MODAL_STATES.UPDATE.USER_EMAIL &&
        <p className="modalText">Pour pouvoir mettre à jour votre adresse e-mail, vous devez saisir votre mot de passe :</p>
        }
        <form
          className="userForm"
          onSubmit={handleUpdateUserInfos}
        >
          <Fieldset
            fieldsetStyle="textFieldset"
            labelStyle="textFieldLabel"
            selectStyle= {
              modalState === MODAL_STATES.UPDATE.USER_ROLE ?
                "textFieldSelect"
                : ""
            }
            legend={
              modalState === MODAL_STATES.UPDATE.USER_FULL_NAME ?
                "Mettez à jour votre nom"
                : modalState === MODAL_STATES.UPDATE.USER_BIRTH_DATE ?
                  "Mettez à jour votre date de naissance"
                  : modalState === MODAL_STATES.UPDATE.USER_EMAIL ?
                    "Mettez à jour votre adresse e-mail"
                    :  modalState === MODAL_STATES.UPDATE.USER_ROLE ?
                      "Mettez à jour votre rôle"
                      : ""
            }
            infos={
              modalState === MODAL_STATES.UPDATE.USER_FULL_NAME ?
                UPDATE_USER_FULL_NAME_INPUTS
                : modalState === MODAL_STATES.UPDATE.USER_BIRTH_DATE ?
                  UPDATE_USER_BIRTH_DATE_INPUTS
                  : modalState === MODAL_STATES.UPDATE.USER_EMAIL ?
                    UPDATE_USER_EMAIL_INPUTS
                    : modalState === MODAL_STATES.UPDATE.USER_ROLE ?
                      UPDATE_USER_ROLE_INPUTS
                      : []
            }
            
            placeholders={
              modalState === MODAL_STATES.UPDATE.USER_FULL_NAME ?
                [currentUser?.firstname ?? "", currentUser?.lastname ?? ""]
                : modalState === MODAL_STATES.UPDATE.USER_BIRTH_DATE ?
                  [formattedBirthDateShort]
                  : modalState === MODAL_STATES.UPDATE.USER_EMAIL ?
                    ["Mot de passe actuel", "Nouvelle adresse e-mail"]
                    : modalState === MODAL_STATES.UPDATE.USER_ROLE ?
                      [currentUser?.role ?? ""]
                      : []
            }
          />
          <div className="buttonsLine">
            <button className="resetButton" type="reset" onClick={() => toggleModals(MODAL_STATES.CLOSE)}>Annuler</button>
            <button className={`submitButton ${isSubmitting ? "disabledButton" : "submitButtonBackgroundColor"}`} disabled={isSubmitting} type="submit">
              Enregistrer
            </button>
          </div>
          {formErrorMessage.length > 0 &&
            <span className="errorMessages">
              {formErrorMessage}
            </span>
          }
        </form>
      </section>
    </div>
  )
}
