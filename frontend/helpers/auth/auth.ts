import { signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail, sendEmailVerification} from "firebase/auth";
import { auth } from "../../lib/firebase/firebase-config";
import { MODAL_STATES } from "@/constants/modalStates";
import { convertFormToObject } from "@/utils/convertForm";

const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL

export async function authenticate (
  form: HTMLFormElement,
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>,
  modalState: string 
) {
  
  //Conversion du formulaire HTML en objet JSON :
  const formObject = convertFormToObject (form)
  if (!formObject) return false
  
  try {
    // SignUp :
    if (modalState === MODAL_STATES.SIGN_UP) {
      // Vérification de saisie identique des deux mots de passe :
      if (formObject.pwd !== formObject.rptpwd) { 
        setErrorMessage ("Les deux mots de passe saisis sont différents") 
        return false
      }
      else { 
        setErrorMessage ("");
      }
      // Création du user dans Firebase :
      const cred = await createUserWithEmailAndPassword (auth, formObject.email, formObject.pwd)
      // Envoi de l'email de vérification de l'adresse email par Firebase :
      await sendEmailVerification(cred.user);
      // Récupération du token de l'utilisateur Firebase :
      const firebaseToken = await cred.user.getIdToken()
      
      // Envoi au backend via la route users/auth/signup :
      const response = await fetch(`${backendURL}/auth/signup`,
        { 
          method: "POST",
          headers: {
            "Authorization": `Bearer ${firebaseToken}`, // Envoi du token firebase
            "Content-Type": "application/json",
          },
          body : JSON.stringify ({
            firstname: formObject.firstname,
            lastname: formObject.lastname,
            email: formObject.email,
            role: formObject.role,
          })
        }
      ); 
      // Réception de la réponse depuis le backend :
      const data = await response.json();
      if (data.error) {
        setErrorMessage (data.error)
        console.error("Erreur lors de la création du nouvel utilisateur :", data.error)
        return false
      }

      return ({response : true, data: data})
    }

    // SignIn :
    if (modalState === MODAL_STATES.SIGN_IN) {
      // Authentification avec Firebase :
      const cred = await signInWithEmailAndPassword (auth, formObject.email, formObject.pwd)

      // Vérification que l'email est bien confirmée :
      if (!cred.user.emailVerified) {
        setErrorMessage("Veuillez valider votre adresse e-mail avant de vous connecter.")
        return false
      }

      if (cred) {
        const firebaseToken = await cred.user.getIdToken ()
        // Envoi au backend via la route users/auth/signin :
        const response = await fetch(`${backendURL}/auth/signin`,
          { 
            method: "POST",
            headers: {
              "Authorization": `Bearer ${firebaseToken}`,
              "Content-Type": "application/json",
            },
            body : JSON.stringify ({
              role : formObject.role
            })
          }
        ); 
        // Réception de la réponse depuis Supabase :
        const data = await response.json();
        if (data.error) {
          setErrorMessage (data.error)
          console.error("Erreur depuis le backend : ", data.error)
          return false
        }
        return ({response : true, data: data.user})
      }
    }

    // Update password :
    if (modalState === MODAL_STATES.PASSWORD) {
      await sendPasswordResetEmail (auth, formObject.email)
      return ({response : true, data: {}})
    }

  } catch (err) {
    const error = err as {code?: string}
    console.error("erreur auth ici : ", error)
    if (error.code === "auth/invalid-email") { setErrorMessage("Format de l'adresse e-mail invalide.") } 
    if (error.code === "auth/email-already-in-use") { setErrorMessage("Une erreur est survenue. Veuillez saisir une autre adresse e-mail.") } 
    if (error.code === "auth/weak-password") { setErrorMessage("Le mot de passe saisi doit contenir au moins 6 caractères.") } 
    if (error.code === "auth/invalid-credential") {setErrorMessage("Adresse e-mail ou mot de passe incorrects.")}
    if (error.code === "auth/user-not-found") {setErrorMessage("Veuillez saisir un email et un mot de passe valides.")}
    else { 
      console.error(err)
    }
    return false
  }
}