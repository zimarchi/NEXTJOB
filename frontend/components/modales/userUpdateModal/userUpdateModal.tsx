import { UPDATE_USER_FULL_NAME_INPUTS, UPDATE_USER_BIRTH_DATE_INPUTS } from "@/constants/formsInfos";
import { MODAL_STATES } from "@/constants/modalStates";
import { useRef, useState } from "react";
import { useAuth } from "@/context/userContext";
import HTMLInputsElements from "@/components/formsInputs/formInputs";
import { updateUser } from "@/helpers/update/updateUser";
import { useRouter } from "next/navigation";

export default function UserUpdateModale() {
  
  const router = useRouter();

  // Etats via useContext
  const {modalState, loading, toggleModals, completedInfosFromForm, updateCurrentUser, firebaseUser, currentUser, formattedBirthDateShort} = useAuth ()
 
  /* completedHTMLInputsElements servira à : 1. passer les infos lors de la validation du formulaire via la fonction handleSignUp. 2. reset le formulaire lors de la validation via la propriété ref du form (resst dans la fonction handleSingUp)*/
  const completedHTMLInputsElements = useRef<HTMLFormElement>(null as unknown as HTMLFormElement)

  // Message d'erreur en bas du formulaire :
  const [formValidationMessage, setFormValidationMessage] = useState("")

  // Gestion de la validation du formulaire :
  const handleUpdateCurrentUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // Vérification de l'état de la connexion :
    if (firebaseUser) {
      // Update de l'utilisateur :
      const updateSuccess = await updateUser (completedHTMLInputsElements, completedInfosFromForm, currentUser.firstname, currentUser.lastname, setFormValidationMessage, modalState)
      if (updateSuccess) {
        toggleModals(MODAL_STATES.CLOSE)
        //MAJ de currentUser :
        updateCurrentUser (updateSuccess)
        // Vidage du formulaire suite à la validation de celui-ci :
        completedHTMLInputsElements.current?.reset()
      }
    }
    if (!firebaseUser && !loading) {
      toggleModals(MODAL_STATES.CLOSE)
      router.push("/")
    }
  }
  
  
  return (
    <div className="modalPage modalPageColor" onClick={() => {
      toggleModals(MODAL_STATES.CLOSE)
      if (!firebaseUser) {
        updateCurrentUser({})
      }
    }}
    >
      <section className="modal" role="dialog" aria-modal="true" aria-labelledby="update-modal-title" onClick={(e) => e.stopPropagation()}>
        {modalState === MODAL_STATES.UPDATE.USER_PHOTO && <h3 id="update-modal-title">Mettez à jour votre photo</h3>}
        {modalState === MODAL_STATES.UPDATE.USER_FULL_NAME && <h3 id="update-modal-title">Modifiez votre nom</h3>}
        {modalState === MODAL_STATES.UPDATE.USER_BIRTH_DATE && <h3 id="update-modal-title">Mettez à jour votre date de naissance</h3>}
        <form
          className="userForm"
          onSubmit={handleUpdateCurrentUser}
          //Transmission de completedHTMLInputsElements depuis le form 
          ref={completedHTMLInputsElements}
        >
          <HTMLInputsElements
                legend = {modalState === MODAL_STATES.UPDATE.USER_FULL_NAME ? "Mettez à jour votre nom" : modalState === MODAL_STATES.UPDATE.USER_BIRTH_DATE ? "Mettez à jour votre date de naissance" : "" }
                infos={modalState === MODAL_STATES.UPDATE.USER_FULL_NAME ? UPDATE_USER_FULL_NAME_INPUTS : modalState === MODAL_STATES.UPDATE.USER_BIRTH_DATE ? UPDATE_USER_BIRTH_DATE_INPUTS : [] }
                style="inputsContainer"
                subStyle="inputLine"
                placeholders= {modalState === MODAL_STATES.UPDATE.USER_FULL_NAME ? [currentUser.firstname!, currentUser.lastname!] : modalState === MODAL_STATES.UPDATE.USER_BIRTH_DATE ? [formattedBirthDateShort] : []}
          />
          <div className="buttonsLine">
            <button className="resetButton" type="reset" onClick={() => toggleModals(MODAL_STATES.CLOSE)}>Annuler</button>
            <button className="submitButton" type="submit">Enregistrer</button>
          </div>
          { formValidationMessage.length > 0 &&
          <span style={{ color: "red", fontSize: 14, width: "100%", display: "block" , height: "15px"}}>
            {formValidationMessage}
          </span>
          }
        </form>
      </section>
    </div>
  )
}
