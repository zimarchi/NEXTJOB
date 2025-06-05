import { signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail} from "firebase/auth";
import { auth } from "../../lib/firebase/firebase-config";
import { formatFromHTMLFormToJSObject } from "../../utils/formatHTMLFormToJSObject";
import { MODAL_STATES } from "@/constants/modalStates";

const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL

export async function authenticate (completedHTMLForm: React.RefObject<HTMLFormElement>, setMessage: React.Dispatch<React.SetStateAction<string>>, completedInfosFromAuthForm: Record <string, string>, modalState: string ) {
  
  //Conversion du formulaire HTML en objet JSON
  formatFromHTMLFormToJSObject (completedHTMLForm, completedInfosFromAuthForm);

  try {
    // SignUp :
    if (modalState === MODAL_STATES.SIGN_UP) {
      // Vérification de saisie identique des deux mots de passe
      if (completedInfosFromAuthForm.pwd !== completedInfosFromAuthForm.rptpwd) { 
        setMessage ("Les deux mots de passe saisis sont différents") 
        return false
      }
      else { 
        setMessage ("");
      }
      // Création du user dans Firebase
      const cred = await createUserWithEmailAndPassword (auth, completedInfosFromAuthForm.email, completedInfosFromAuthForm.pwd)
      const firebaseIdToken = await cred.user.getIdToken ()
      // Envoi au backend via la route users/signup
      const response = await fetch(`${backendURL}/auth/signup`,
        { 
          method: "POST",
          headers: {
            "Authorization": `Bearer ${firebaseIdToken}`, // Envoi du token firebase
            "Content-Type": "application/json",
          },
          body : JSON.stringify ({
            firstname: completedInfosFromAuthForm.firstname,
            lastname: completedInfosFromAuthForm.lastname,
            email: completedInfosFromAuthForm.email,
            role: completedInfosFromAuthForm.role,
          })
        }
      ); 
      // Réception de la réponse depuis le backend :
      const data = await response.json();
      if (data.error) {
        setMessage (data.error)
        console.error("Erreur lors de la création du nouvel utilisateur :", data.error)
        return false
      }

      return ({response : true, data: data})
    }

    // SignIn :
    if (modalState === MODAL_STATES.SIGN_IN) {
      // Authentification avec Firebase
      const cred = await signInWithEmailAndPassword (auth, completedInfosFromAuthForm.email, completedInfosFromAuthForm.pwd)
      if (cred) {
        const firebaseIdToken = await cred.user.getIdToken ()
        // Envoi au backend via la route users/signin
        const response = await fetch(`${backendURL}/auth/signin`,
          { 
            method: "POST",
            headers: {
              "Authorization": `Bearer ${firebaseIdToken}`,
              "Content-Type": "application/json",
            },
            body : JSON.stringify ({
              role : completedInfosFromAuthForm.role
            })
          }
        ); 
        // Réception de la réponse depuis Supabase :
        const data = await response.json();
        if (data.error) {
          setMessage (data.error)
          console.error("Erreur depuis le backend : ", data.error)
          return false
        }
        return ({response : true, data: data.user})
      }
    }

    // Update password :
    if (modalState === MODAL_STATES.PASSWORD) {
      await sendPasswordResetEmail (auth, completedInfosFromAuthForm.email)
      return ({response : true, data: {}})
    }

  }
  catch (err) {
    const error = err as {code?: string}
    if (error.code === "auth/invalid-email") { setMessage("Format de l'adresse email invalide") } 
    if (error.code === "auth/email-already-in-use") { setMessage("Cette adresse email est déjà utilisée") } 
    if (error.code === "auth/weak-password") { setMessage("Le mot de passe saisi doit contenir au moins 6 caractères") } 
    if (error.code === "auth/invalid-credential") {setMessage("Adresse email ou mot de passe incorrects")}
    else { 
      console.error(err)
    }
    return false
  }
}