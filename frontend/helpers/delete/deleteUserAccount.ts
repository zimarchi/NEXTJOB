import { getAuth, User, reauthenticateWithCredential, EmailAuthProvider, deleteUser } from "firebase/auth";
import { convertFormToObject } from "@/utils/convertForm";
import { deleteUserPhoto } from "./deleteUserPhoto";

const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL
const auth = getAuth();
const firebaseUser: User | null = auth.currentUser;

interface CurrentUser {
  firstname?: string;
  lastname?: string;
  email?: string;
  birth_date?: string;
  role?: string;
  user_photo_url?: string;
}

export async function deleteUserAccount (
    form: HTMLFormElement, 
    currentUser : CurrentUser,
    setErrorMessage: React.Dispatch<React.SetStateAction<string>>, 

) {

    // Conversion du formulaire HTML en objet JSON
    const formObject = convertFormToObject (form)

    // Vérification que le formulaire est rempli et que l'utilisateur est connecté
    if (!formObject || !firebaseUser)  {
        return false
    }

    try {
        if (currentUser.email && formObject.pwd) {
            // Réauthentification par Firebase avant suppression du compte 
            const credential = EmailAuthProvider.credential(currentUser.email, formObject.pwd);
            await reauthenticateWithCredential(firebaseUser, credential)
            // Récupère et rafraichis le token Firebase actuel :
            const firebaseToken = await firebaseUser.getIdToken(true);
            // Envoi au backend du token pour vérification par Firebase puis suppression du user dans Supabase puis dans Firebase :
            const response = await fetch (`${backendURL}/delete/userAccount`, {
                method: "DELETE",
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${firebaseToken}`,
                }
            })
            // Réception de la requete de suppression du user depuis la bdd Supabase :
            const { userDeleted } = await response.json();
            if (!response.ok) throw new Error ("Erreur du backend.")
            if (userDeleted) {
                // Suppression de la photo du user dans Supabase storage :
                if (currentUser.user_photo_url) {
                    await deleteUserPhoto (currentUser.user_photo_url);
                }
                // Suppression du compte dans Firebase :
                await deleteUser (firebaseUser)
                return true
            }
            return false
        }

    } catch (err) {
        const error = err as {code?: string}
        console.error(error)
        setErrorMessage ("Erreur lors de la suppressioon de l'utilisateur.")
        return false
    }

}