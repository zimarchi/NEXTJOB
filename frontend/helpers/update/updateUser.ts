import { getAuth, User } from "firebase/auth";
import { MODAL_STATES } from "@/constants/modalStates";
import { convertFormToObject } from "@/utils/convertForm";

const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL
const auth = getAuth();
const firebaseUser: User | null = auth.currentUser;

export async function updateUser (
    form: HTMLFormElement, 
    originalFirstname: string | undefined,
    originalLastname: string | undefined,
    originalBirthdate: string | undefined,
    setMessage: React.Dispatch<React.SetStateAction<string>>, 
    modalState: string,
) {

    //Conversion du formulaire HTML en objet JSON
    const formObject = convertFormToObject (form)
    //console.log(formObject)
    if (!formObject || !firebaseUser) return false

    try {

        if (modalState === MODAL_STATES.UPDATE.USER_FULL_NAME) {
            // Vérification de changement par rapport à l'existant
            if (originalFirstname === formObject.firstname && originalLastname === formObject.lastname) {
                setMessage("Aucune modification. Veuillez modifier votre prénom ou votre nom ou annuler l'action.")
                return false
            }
        }

        if (modalState === MODAL_STATES.UPDATE.USER_BIRTH_DATE) {
            // Vérification de changement par rapport à l'existant
            const dbDate = originalBirthdate?.split("T")[0]
            if (dbDate === formObject.birthdate) {
                setMessage("Aucune modification. Veuillez modifier votre date de naissance ou annuler l'action.")
                return false
            }
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
                firstname : formObject.firstname || originalFirstname,
                lastname : formObject.lastname || originalLastname,
                birthdate: formObject.birthdate || originalBirthdate,
            })
        });
        // Réception de la réponse depuis Supabase :
        const { user } = await response.json();
        return user || false;
    
    } catch (err) {
        console.error(err)
        return false
    }
}