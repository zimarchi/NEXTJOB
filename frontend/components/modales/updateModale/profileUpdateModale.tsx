import { updateUserFullName, updateUserProfilePhoto } from "@/lib/formsInputsInfos/formsInfos";
import { useRef, useState } from "react";
import { useAuth } from "@/lib/context/userContext";
import AccountFormInputs from "@/components/formsInputs/authFormInputs";

export default function ProfileUpdateModale() {

  /*  inputsRef servira à transmettre les infos saisies dans les composants enfants SigninUpFormInputs au composant parent SigninUpModale via la props "ref". 
  completedRef servira à : 1. passer les infos lors de la validation du formulaire via la fonction handleSignUp. 2. reset le formulaire lors de la validation via la propriété ref du form (resst dans la fonction handleSingUp)*/
  const inputsRef = useRef<HTMLInputElement[]>([])
  const completedRef = useRef<HTMLInputElement[]>([])

  // Etats via useContext
  const {modalState, toggleModals} = useAuth ()

  const handleUpdateForm = async (e: any) => {
    e.preventDefault()
    //// Authentification :
    //const authSuccess = await handleAuth (completedRef, setFormValidationMessage, currentUser, modalState)
    // if (authSuccess) {
    //   toggleModals("close")
    //MAJ de currentUser :
    // updateCurrentUser (authSuccess.data)
    // Routage vers la bonne home page : 
    // Vidage du formulaire suite à la validation de celui-ci :
    completedRef.current.reset()
  }

  // Message d'erreur en bas du formulaire :
  const [formValidationMessage, setFormValidationMessage] = useState("")
  
  return (
    <>
    <div className="modalPage" onClick={() => toggleModals("close")}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        {modalState === "updateProfilePhoto" && <h3>Mettez à jour votre photo</h3>}
        {modalState === "updateFullName" && <h3>Modifiez votre nom</h3>}
        {modalState === "updateBirthDate" && <h3>Mettez à jour votre date de naissance</h3>}
        <form
          className="authForm"
          onSubmit={handleUpdateForm}
          //Transmission de completedRef depuis le form 
          ref={completedRef}>
          <AccountFormInputs
            infos={modalState === "updateFullName" ? updateUserFullName : modalState === "updateFullName" ? updateUserProfilePhoto : []}
            style="inputsContainer"
            subStyle="inputLine"
            //Transmission de inputsRef depuis la modale vers le composant enfant
            ref={inputsRef}
          />
          <div className="buttonsLine">
            <button className="resetButton" type="reset">Annuler</button>
            <button className="submitButton" type="submit">Enregistrer</button>
          </div>
          <span style={{ color: "red", fontSize: 14, width: "100%", display: "block", height: "15px" }}>
            {formValidationMessage}
          </span>
        </form>
      </div>
    </div>
    </>
  )
}
