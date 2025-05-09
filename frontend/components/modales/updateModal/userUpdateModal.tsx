import { updateUserFullName, updateUserBirthDate } from "@/lib/formsInputsInfos/formsInfos";
import { useRef, useState } from "react";
import { useAuth } from "@/lib/context/userContext";
import HTMLInputsElements from "@/components/formsInputs/formInputs";
import { handleUpdateUser } from "@/lib/modules/user/update/updateUser";

export default function UserUpdateModale() {
  
  // Etats via useContext
  const {modalState, toggleModals, completedInfosFromForm, updateCurrentUser, firebaseUser, currentUser, formattedBirthDateShort} = useAuth ()
 
  /* completedHTMLInputsElements servira à : 1. passer les infos lors de la validation du formulaire via la fonction handleSignUp. 2. reset le formulaire lors de la validation via la propriété ref du form (resst dans la fonction handleSingUp)*/
  const completedHTMLInputsElements = useRef<HTMLFormElement>(null as unknown as HTMLFormElement)

  // Message d'erreur en bas du formulaire :
  const [formValidationMessage, setFormValidationMessage] = useState("")

  // Gestion de la validation du formulaire :
  const handleUserUpdateForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log("formulaire complet", completedHTMLInputsElements)
    // Update de l'utilisateur :
    const updateSuccess = await handleUpdateUser (completedHTMLInputsElements, completedInfosFromForm, currentUser.firstname, currentUser.lastname, setFormValidationMessage, modalState)
    if (updateSuccess) {
      toggleModals("close")
      //MAJ de currentUser :
      updateCurrentUser (updateSuccess)
      // Vidage du formulaire suite à la validation de celui-ci :
      completedHTMLInputsElements.current?.reset()
    }
  }
  
  
  return (
    <div className="modalPage modalPageColor" onClick={() => {
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
          className="userForm"
          onSubmit={handleUserUpdateForm}
          //Transmission de completedHTMLInputsElements depuis le form 
          ref={completedHTMLInputsElements}
        >
          <HTMLInputsElements
                infos={modalState === "updateFullName" ? updateUserFullName : modalState === "updateBirthDate" ? updateUserBirthDate : [] }
                style="inputsContainer"
                subStyle="inputLine"
                placeholders= {modalState === "updateFullName" ? [currentUser.firstname!, currentUser.lastname!] : modalState === "updateBirthDate" ? [formattedBirthDateShort] : []}
          />
          <div className="buttonsLine">
            <button className="resetButton" type="reset" onClick={() => toggleModals("close")}>Annuler</button>
            <button className="submitButton" type="submit">Enregistrer</button>
          </div>
          { formValidationMessage.length > 0 &&
          <span style={{ color: "red", fontSize: 14, width: "100%", display: "block" , padding: "20px 0px 0px 0px"}}>
            {formValidationMessage}
          </span>
          }
        </form>
      </div>
    </div>
  )
}
