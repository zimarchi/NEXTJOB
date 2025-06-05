import HTMLInputsElements from "@/components/formsInputs/formInputs";
import { useRef, useState } from "react";
import { useAuth } from "@/context/userContext";
import { SIGN_IN_INPUTS, SIGN_UP_INPUTS, USERS_ROLES_RADIO_BUTTONS, UPDATE_PASSWORD_INPUTS } from "@/constants/formsInfos";
import { MODAL_STATES } from "@/constants/modalStates";
import { authenticate } from "@/helpers/auth/auth";
import { useRouter } from "next/navigation";

export default function AuthModal() {

  const router = useRouter ()
  
  // Etats via useContext
  const { modalState, toggleModals, completedInfosFromForm, updateCurrentUser, firebaseUser} = useAuth ()

  // Modales à masquer
  const updateModals = Object.values(MODAL_STATES.UPDATE);
  const modalsToHide = [MODAL_STATES.MON_COMPTE, MODAL_STATES.CLOSE, ...updateModals]

  /* completedHTMLInputsElements servira à : 1. passer les infos lors de la validation du formulaire via la fonction handleForm. 2. reset le formulaire lors de la validation via la propriété ref du form (reset dans la fonction handleAuth)*/
  const completedHTMLInputsElements = useRef<HTMLFormElement>(null as unknown as HTMLFormElement)

  // Message d'erreur en bas du formulaire :
  const [formValidationMessage, setFormValidationMessage] = useState("")

  // Gestion de la validation du formulaire :
  const handleAuth = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    //// Authentification :
    const authSuccess = await authenticate (completedHTMLInputsElements, setFormValidationMessage, completedInfosFromForm, modalState)
    if (authSuccess) {
      toggleModals(MODAL_STATES.CLOSE)
      //MAJ de currentUser :
      updateCurrentUser (authSuccess.data)
      // Routage vers la bonne home page : 
      router.push(`/${authSuccess.data.categorie || ""}`)
      // Vidage du formulaire suite à la validation de celui-ci :
      completedHTMLInputsElements.current?.reset()
    }
  }

  return (
    <>
      {!modalsToHide.includes(modalState) &&
        <section 
          className="modalPage modalPageColor" 
          onClick={() => {
            toggleModals(MODAL_STATES.CLOSE)
            if (!firebaseUser) {
              updateCurrentUser({})
            }
          }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="auth-dialog-title"
        >
          <div className="modal" onClick={(e) => e.stopPropagation() } >
            {modalState === MODAL_STATES.SIGN_IN && <h2 id="auth-dialog-title">Vous avez déjà un compte ?</h2>}
            {modalState === MODAL_STATES.SIGN_UP && <h2 id="auth-dialog-title">Créez votre compte !</h2>}
            {modalState === MODAL_STATES.PASSWORD && 
            <>
              <h2 id="auth-dialog-title">Mettez à jour votre mot de passe</h2>
              <p>Un e-mail vous sera envoyé pour réinitialiser votre mot de passe.</p>
            </>
            }
            <form
              className="userForm"
              onSubmit={handleAuth}
              //Transmission de completedHTMLInputsElements depuis le form 
              ref={completedHTMLInputsElements}
              >
              {modalState !== MODAL_STATES.PASSWORD &&
              <HTMLInputsElements
                legend="Votre rôle"
                infos = {USERS_ROLES_RADIO_BUTTONS}
                containerStyle="usersRolesRadioButtonsContainer"
                fieldStyle="radioButtonField"
                labelStyle="radioButtonLabel"
                placeholders= {[]}
              />
              }
              <HTMLInputsElements
                legend="Informations personnelles"
                infos={modalState === MODAL_STATES.SIGN_IN ? SIGN_IN_INPUTS : modalState === MODAL_STATES.SIGN_UP ? SIGN_UP_INPUTS : UPDATE_PASSWORD_INPUTS}
                containerStyle="inputsContainer"
                fieldStyle="inputField"
                placeholders= {[]}
              />
              {modalState === MODAL_STATES.SIGN_IN &&
              <button className = "fakeButton" onClick={() => toggleModals(MODAL_STATES.PASSWORD)} >Mot de passe oublié ?</button>
              }
              <div className="buttonsLine">
                <button type="reset" className="resetButton" onClick={() => toggleModals(MODAL_STATES.CLOSE)}>
                  Annuler
                </button>
                <button type="submit" className="submitButton">
                  {modalState === MODAL_STATES.SIGN_IN ? "Se connecter" : modalState === MODAL_STATES.SIGN_UP ? "S'inscrire" : "Envoyer e-mail"}
                </button>
              </div>
              { formValidationMessage.length > 0 &&
              <span style={{ color: "red", fontSize: 14, width: "100%", display: "block", height: "15px" }}>
                {formValidationMessage}
              </span>
              }
            </form>
            {[MODAL_STATES.SIGN_IN, MODAL_STATES.SIGN_UP].includes(modalState) &&
            <div className="connecterCreerCompte">
              <p>{modalState === MODAL_STATES.SIGN_IN ? "Vous n'avez pas de compte ?" : "Vous avez déjà un compte ?" }</p>
              <button  
                className = "fakeButton" 
                onClick={() => { 
                  if (modalState === MODAL_STATES.SIGN_IN) {
                    toggleModals(MODAL_STATES.SIGN_UP)
                  } 
                  if (modalState === MODAL_STATES.SIGN_UP) {
                    toggleModals(MODAL_STATES.SIGN_IN)
                  } 
                  setFormValidationMessage ("")
                }}>
                {modalState === MODAL_STATES.SIGN_IN ? "Créez-le !" : "Connectez-vous !" }
              </button>
            </div>
            }
          </div>
        </section>
      }
    </>
  );
}