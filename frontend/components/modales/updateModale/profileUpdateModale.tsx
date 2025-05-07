import { updateUserFullName, updateUserBirthDate, updateUserProfilePhoto } from "@/lib/formsInputsInfos/formsInfos";
import { useRef, useState } from "react";
import { useAuth } from "@/lib/context/userContext";
import HTMLInputsElements from "@/components/formsInputs/formInputs";

export default function ProfileUpdateModale() {
  
  // Etats via useContext
  const {modalState, toggleModals, completedInfosFromForm, updateCurrentUser, firebaseUser, currentUser} = useAuth ()
 
  /* completedHTMLInputsElements servira à : 1. passer les infos lors de la validation du formulaire via la fonction handleSignUp. 2. reset le formulaire lors de la validation via la propriété ref du form (resst dans la fonction handleSingUp)*/
  const completedHTMLInputsElements = useRef<HTMLFormElement>(null as unknown as HTMLFormElement)

  // Message d'erreur en bas du formulaire :
  const [formValidationMessage, setFormValidationMessage] = useState("")

  // Gestion de la validation du formulaire :
  const handleProfileUpdateForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    //// Update de l'utilisateur :
    // const updateSuccess = await handleUpdateProfile (completedHTMLInputsElements, setFormValidationMessage, completedInfosFromForm, modalState)
    // if (updateSuccess) {
    //   toggleModals("close")
    //   //MAJ de currentUser :
    //   updateCurrentUser (updateSuccess.data)
    //   // Vidage du formulaire suite à la validation de celui-ci :
    //   completedHTMLInputsElements.current?.reset()
    // }
  }
  
  return (
    <div className="modalPage" onClick={() => {
      toggleModals("close")
      if (!firebaseUser) {
        updateCurrentUser({})
      }
    }}
    >
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        {modalState === "updateProfilePhoto" && <h3>Mettez à jour votre photo</h3>}
        {modalState === "updateFullName" && <h3>Modifiez votre nom</h3>}
        {modalState === "updateBirthDate" && <h3>Mettez à jour votre date de naissance</h3>}
        <form
          className="authForm"
          onSubmit={handleProfileUpdateForm}
          //Transmission de completedHTMLInputsElements depuis le form 
          ref={completedHTMLInputsElements}
        >
          <HTMLInputsElements
                infos={modalState === "updateFullName" ? updateUserFullName : modalState === "updateBirthDate" ? updateUserBirthDate : [] }
                style="inputsContainer"
                subStyle="inputLine"
          />
          <div className="buttonsLine">
            <button className="resetButton" type="reset" onClick={() => toggleModals("close")}>Annuler</button>
            <button className="submitButton" type="submit">Enregistrer</button>
          </div>
          <span style={{ color: "red", fontSize: 14, width: "100%", display: "block", height: "15px" }}>
            {formValidationMessage}
          </span>
        </form>
      </div>
    </div>
  )
}
