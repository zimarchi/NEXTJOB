import { formatFromHTMLFormToJSObject } from "../../formatHTMLFormToJSObject";
import { getAuth, User } from "firebase/auth";

export async function handleUpdateUser (
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
        if (modalState === "updateFullName") {
            // Vérification de changement par rapport à l'existant
            if (originalFirstname === completedInfosFromAuthForm.firstname && originalLastname === completedInfosFromAuthForm.lastname) {
                setMessage("Aucune modification. Veuillez modifier votre prénom ou votre nom ou annuler l'action.")
                return false
            }
            // Récupère et rafraichis le token Firebase actuel :
            const firebaseIdToken = await firebaseUser.getIdToken(true);
            // Envoi au backend du token pour vérification par Firebase puis mise à jour sur Supabase :
            const response = await fetch ("http://localhost:3000/updateUser", {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${firebaseIdToken}`,
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

    } catch (err) {
        console.error(err)
        return false
    }
}