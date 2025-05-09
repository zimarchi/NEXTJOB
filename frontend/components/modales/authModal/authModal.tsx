import HTMLInputsElements from "../../formsInputs/formInputs";
import { useRef, useState } from "react";
import { useAuth } from "@/lib/context/userContext";
import { signInInputsInfos, signUpInputsInfos, recruteurCandidatRadioButtonsInfos, passwordInfos } from "@/lib/formsInputsInfos/formsInfos";
import { handleAuth } from "@/lib/modules/user/auth/auth";
import { useRouter } from "next/navigation";

export default function AuthModal() {

  const router = useRouter ()
  
  // Etats via useContext
  const { modalState, toggleModals, completedInfosFromForm, updateCurrentUser, firebaseUser} = useAuth ()

  /* completedHTMLInputsElements servira à : 1. passer les infos lors de la validation du formulaire via la fonction handleForm. 2. reset le formulaire lors de la validation via la propriété ref du form (reset dans la fonction handleAuth)*/
  const completedHTMLInputsElements = useRef<HTMLFormElement>(null as unknown as HTMLFormElement)

  // Message d'erreur en bas du formulaire :
  const [formValidationMessage, setFormValidationMessage] = useState("")

  // Gestion de la validation du formulaire :
  const handleAuthForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    //// Authentification :
    const authSuccess = await handleAuth (completedHTMLInputsElements, setFormValidationMessage, completedInfosFromForm, modalState)
    if (authSuccess) {
      toggleModals("close")
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
      {!["monCompte", "close", "updateFullName"].includes(modalState) &&
        <div 
          className="modalPage modalPageColor" 
          onClick={() => {
            toggleModals("close")
            if (!firebaseUser) {
              updateCurrentUser({})
            }
          }}
        >
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            {modalState === "signin" && <h2>Vous avez déjà un compte ?</h2>}
            {modalState === "signup" && <h2>Créez votre compte !</h2>}
            {modalState === "password" && 
            <>
              <h2>Mettez à jour votre mot de passe</h2>
              <p>Un e-mail vous sera envoyé pour réinitialiser votre mot de passe.</p>
            </>
            }
            <form
              className="userForm"
              onSubmit={handleAuthForm}
              //Transmission de completedHTMLInputsElements depuis le form 
              ref={completedHTMLInputsElements}>
              <HTMLInputsElements
                infos={modalState !== "password" ? recruteurCandidatRadioButtonsInfos : []}
                style="recruteurCandidatRadioButtonsContainer"
                subStyle="radioButtonLine"
                placeholders= {[]}
              />
              <HTMLInputsElements
                infos={modalState === "signin" ? signInInputsInfos : modalState === "signup" ? signUpInputsInfos : passwordInfos}
                style="inputsContainer"
                subStyle="inputLine"
                placeholders= {[]}
              />
              {modalState === "signin" &&
              <button className = "fakeButton" onClick={() => toggleModals("password")} >Mot de passe oublié ?</button>
              }
              <div className="buttonsLine">
                <button type="reset" className="resetButton" onClick={() => toggleModals("close")}>
                  Annuler
                </button>
                <button type="submit" className="submitButton">
                  {modalState === "signin" ? "Se connecter" : modalState === "signup" ? "S'inscrire" : "Envoyer e-mail"}
                </button>
              </div>
              { formValidationMessage.length>0 &&
              <span style={{ color: "red", fontSize: 14, width: "100%", display: "block", height: "15px" }}>
                {formValidationMessage}
              </span>
              }
            </form>
            {["signin", "signup"].includes(modalState) &&
            <div className="connecterCreerCompte">
              <p>{modalState === "signin" ? "Vous n'avez pas de compte ?" : "Vous avez déjà un compte ?" }</p>
              <button  
                className = "fakeButton" 
                onClick={() => { 
                  if (modalState === "signin") {
                    toggleModals("signup")
                  } 
                  if (modalState === "signup") {
                    toggleModals("signin")
                  } 
                  setFormValidationMessage ("")
                }}>
                <p>{modalState === "signin" ? "Créez-le !" : "Connectez-vous !" }</p>
              </button>
            </div>
            }
          </div>
        </div>
      }
    </>
  );
}