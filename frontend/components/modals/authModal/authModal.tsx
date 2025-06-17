import Fieldset from "@/components/forms/formFieldset";
import { useState } from "react";
import { useAuth } from "@/context/userContext";
import { SIGN_IN_INPUTS, SIGN_UP_INPUTS, USERS_ROLES_RADIO_BUTTONS, UPDATE_PASSWORD_INPUTS } from "@/constants/formsInfos";
import { MODAL_STATES } from "@/constants/modalStates";
import { authenticate } from "@/helpers/auth/auth";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase/firebase-config";

export default function AuthModal() {

  const router = useRouter ()
  
  // Etats via useContext
  const { modalState, toggleModals, updateCurrentUser, firebaseUser} = useAuth ()

  // Modales à masquer
  const updateModals = Object.values(MODAL_STATES.UPDATE);
  const modalsToHide = [MODAL_STATES.MON_COMPTE, MODAL_STATES.CLOSE, ...updateModals]

  // Message d'erreur en bas du formulaire :
  const [formValidationMessage, setFormValidationMessage] = useState("")

  // Affichage du message de confirmation d'inscription pour les nvx users qui n'ont pas encore validé leur email :
  const [emailConfirmed, setEmailConfirmed] = useState(true) 

  // Gestion de la validation du formulaire :
  const handleAuth = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    //// Authentification :
    const authSuccess = await authenticate (e.currentTarget, setFormValidationMessage, modalState)
    if (authSuccess) {
      // Si l'utilisateur n'a pas encore confirmé son email :
      if (modalState === MODAL_STATES.SIGN_UP) {
        setEmailConfirmed(false)
        await signOut (auth)
      }
      // Si l'utilisateur a confirmé son email :
      if (modalState === MODAL_STATES.SIGN_IN) {
        toggleModals(MODAL_STATES.CLOSE)
        //MAJ de currentUser :
        updateCurrentUser (authSuccess.data)
        // Routage vers la bonne home page : 
        router.push(`/${authSuccess.data.role || ""}`)
      }
    }
    // Si l'authentification échoue, logOut de Firebase :
    if (!authSuccess) {
      await signOut (auth)
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
              updateCurrentUser(null)
            }
          }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="auth-dialog-title"
        >
          {emailConfirmed &&
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
            >
              {modalState !== MODAL_STATES.PASSWORD &&
              <Fieldset
                legend="Votre rôle"
                infos = {USERS_ROLES_RADIO_BUTTONS}
                fieldsetStyle="radioButtonsFieldset"
                labelStyle="radioButtonFieldLabel"
              />
              }
              <Fieldset
                legend="Informations personnelles"
                infos={modalState === MODAL_STATES.SIGN_IN ? SIGN_IN_INPUTS : modalState === MODAL_STATES.SIGN_UP ? SIGN_UP_INPUTS : UPDATE_PASSWORD_INPUTS}
                fieldsetStyle="textFieldset"
                labelStyle="textFieldLabel"
                inputStyle="textFieldInput"
              />
              {modalState === MODAL_STATES.SIGN_IN &&
              <button type = "button" className = "fakeButton" onClick={() => toggleModals(MODAL_STATES.PASSWORD)} >Mot de passe oublié ?</button>
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
          }
          {!emailConfirmed &&
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h4>🎉 Votre compte a été créé !</h4>
            <p style={{ color: "var(--submitButton-background-color)", fontSize: 16, maxWidth: "400px" }}>
              Un e-mail de confirmation vous a été envoyé. Veuillez vérifier votre boîte de réception avant de vous connecter.
            </p> 
            <button type="reset" className="resetButton" onClick={() => toggleModals(MODAL_STATES.CLOSE)}>
              Fermer
            </button>     
          </div>
          }
        </section>
      }
    </>
  );
}