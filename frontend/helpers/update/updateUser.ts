import { formatFromHTMLFormToJSObject } from "../../utils/formatHTMLFormToJSObject";
import { getAuth, User } from "firebase/auth";
import { MODAL_STATES } from "@/constants/modalStates";

const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL

export async function updateUser (
    completedHTMLForm: React.RefObject<HTMLFormElement>, 
    completedInfosFromAuthForm: Record <string, string>,
    originalFirstname: string | undefined,
    originalLastname: string | undefined,
    setMessage: React.Dispatch<React.SetStateAction<string>>, 
    modalState: string,
) {

    const auth = getAuth();
    const firebaseUser: User | null = auth.currentUser;

    if (!firebaseUser) return false

    //Conversion du formulaire HTML en objet JSON
    formatFromHTMLFormToJSObject (completedHTMLForm, completedInfosFromAuthForm);

    try {
        if (modalState === MODAL_STATES.UPDATE.USER_FULL_NAME) {
            // Vérification de changement par rapport à l'existant
            if (originalFirstname === completedInfosFromAuthForm.firstname && originalLastname === completedInfosFromAuthForm.lastname) {
                setMessage("Aucune modification. Veuillez modifier votre prénom ou votre nom ou annuler l'action.")
                return false
            }
            // Récupère et rafraichis le token Firebase actuel :
            const firebaseToken = await firebaseUser.getIdToken(true);
            // Envoi au backend du token pour vérification par Firebase puis mise à jour sur Supabase :
            const response = await fetch (`${backendURL}/updateUser`, {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${firebaseToken}`,
                },
                body : JSON.stringify ({
                    firstname : completedInfosFromAuthForm.firstname,
                    lastname : completedInfosFromAuthForm.lastname,
                  })
            });
            // Réception de la réponse depuis Supabase :
            const data = await response.json();
            // Renvoi du currentUser en front pour mise à jour dans le contexte :
            return (data.user)
        }
        if (modalState === MODAL_STATES.UPDATE.USER_BIRTH_DATE) {
            
        }

    } catch (err) {
        console.error(err)
        return false
    }
}