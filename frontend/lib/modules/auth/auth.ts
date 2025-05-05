import { signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail} from "firebase/auth";
import { auth } from "../../firebase/firebase-config";
import { formatFromHTMLFormToJSObject } from "./formatHTMLToJSObject";

export async function handleAuth (completedHTMLForm: React.RefObject<HTMLFormElement>, setMessage: React.Dispatch<React.SetStateAction<string>>, completedInfosFromAuthForm: Record <string, string>, modalState: string ) {
  
  //Remplissage du currentUser
  formatFromHTMLFormToJSObject (completedHTMLForm, completedInfosFromAuthForm);

  try {
    // SignUp :
    if (modalState === "signup") {
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
      const response = await fetch("http://localhost:3000/users/signup",
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
            categorie: completedInfosFromAuthForm.categorie,
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
      console.log("User créé dans Supabase", data)

      return ({response : true, data: data})
    }

    // SignIn :
    if (modalState === "signin") {
      // Authentification avec Firebase
      const cred = await signInWithEmailAndPassword (auth, completedInfosFromAuthForm.email, completedInfosFromAuthForm.pwd)
      if (cred) {
        const firebaseIdToken = await cred.user.getIdToken ()
        // Envoi au backend via la route users/signin
        const response = await fetch("http://localhost:3000/users/signin",
          { 
            method: "POST",
            headers: {
              "Authorization": `Bearer ${firebaseIdToken}`,
              "Content-Type": "application/json",
            },
            body : JSON.stringify ({
              categorie : completedInfosFromAuthForm.categorie
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
    if (modalState === "updatePwd") {
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