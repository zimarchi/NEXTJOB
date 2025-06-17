import { UPDATE_USER_FULL_NAME_INPUTS, UPDATE_USER_BIRTH_DATE_INPUTS, UPDATE_USER_EMAIL_INPUTS } from "@/constants/formsInfos";
import { MODAL_STATES } from "@/constants/modalStates";
import { useState } from "react";
import { useAuth } from "@/context/userContext";
import Fieldset from "@/components/forms/formFieldset";
import { updateUserInfos } from "@/helpers/update/updateUserInfos";
import { useRouter } from "next/navigation";

export default function UserInfosUpdateModal() {

  const router = useRouter();

  // Etats via useContext
  const { modalState, loading, toggleModals, updateCurrentUser, firebaseUser, currentUser, formattedBirthDateShort } = useAuth()

  // Message d'erreur en bas du formulaire :
  const [formValidationMessage, setFormValidationMessage] = useState("")

  // Gestion de la validation du formulaire :
  const handleUpdateUserInfos = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // Vérification de l'état de la connexion :
    if (firebaseUser && currentUser) {
      // Update de l'utilisateur :
      const infosUpdateSuccess = await updateUserInfos(
        e.currentTarget,
        currentUser.firstname,
        currentUser.lastname,
        currentUser.birth_date,
        setFormValidationMessage,
        modalState,
      )
      if (infosUpdateSuccess) {
        toggleModals(MODAL_STATES.CLOSE)
        // MAJ de currentUser :
        updateCurrentUser(infosUpdateSuccess)
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
      case MODAL_STATES.UPDATE.USER_FULL_NAME:
        return "Mettez à jour votre nom";
      case MODAL_STATES.UPDATE.USER_BIRTH_DATE:
        return "Mettez à jour votre date de naissance";
      case MODAL_STATES.UPDATE.USER_EMAIL:
        return "Mettez à jour votre email";
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
        <form
          className="userForm"
          onSubmit={handleUpdateUserInfos}
        >
          <Fieldset
            legend={
              modalState === MODAL_STATES.UPDATE.USER_FULL_NAME ?
                "Mettez à jour votre nom"
                : modalState === MODAL_STATES.UPDATE.USER_BIRTH_DATE ?
                  "Mettez à jour votre date de naissance"
                  : modalState === MODAL_STATES.UPDATE.USER_EMAIL ?
                    "Mettez à jour votre adresse email"
                    : ""
            }
            infos={
              modalState === MODAL_STATES.UPDATE.USER_FULL_NAME ?
                UPDATE_USER_FULL_NAME_INPUTS
                : modalState === MODAL_STATES.UPDATE.USER_BIRTH_DATE ?
                  UPDATE_USER_BIRTH_DATE_INPUTS
                  : modalState === MODAL_STATES.UPDATE.USER_EMAIL ?
                    UPDATE_USER_EMAIL_INPUTS
                    : []
            }
            fieldsetStyle="textFieldset"
            placeholders={
              modalState === MODAL_STATES.UPDATE.USER_FULL_NAME ?
                [currentUser?.firstname ?? "", currentUser?.lastname ?? ""]
                : modalState === MODAL_STATES.UPDATE.USER_BIRTH_DATE ?
                  [formattedBirthDateShort]
                  : modalState === MODAL_STATES.UPDATE.USER_EMAIL ?
                    [currentUser?.email ?? ""]
                    : []
            }
          />
          <div className="buttonsLine">
            <button className="resetButton" type="reset" onClick={() => toggleModals(MODAL_STATES.CLOSE)}>Annuler</button>
            <button className="submitButton" type="submit">Enregistrer</button>
          </div>
          {formValidationMessage.length > 0 &&
            <span style={{ color: "red", fontSize: 14, width: "300px", display: "block", height: "15px" }}>
              {formValidationMessage}
            </span>
          }
        </form>
      </section>
    </div>
  )
}
