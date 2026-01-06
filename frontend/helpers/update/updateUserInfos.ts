import { getAuth, User, updateEmail, reauthenticateWithCredential, EmailAuthProvider, sendEmailVerification } from "firebase/auth";
import { MODAL_STATES } from "@/constants/modalStates";
import { convertFormToObject } from "@/utils/convertForm";


const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL
const auth = getAuth();
const firebaseUser: User | null = auth.currentUser;

interface CurrentUser {
  firstname?: string;
  lastname?: string;
  email?: string;
  birth_date?: string;
  role?: string;
}

export async function updateUserInfos (
    form: HTMLFormElement, 
    currentUser : CurrentUser,
    setErrorMessage: React.Dispatch<React.SetStateAction<string>>, 
    modalState: string,
) {
    // Conversion du formulaire HTML en objet JSON :
    const formObject = convertFormToObject (form)
    
    // Vérification que le formulaire est rempli et que l'utilisateur est connecté :
    if (!formObject || !firebaseUser)  {
        return false
    }

    try {
        // MAJ nom et prénom :
        if (modalState === MODAL_STATES.UPDATE.USER_FULL_NAME) {
            // Vérification de changement par rapport à l'existant :
            if (currentUser.firstname === formObject.firstname && currentUser.lastname === formObject.lastname) {
                setErrorMessage("Aucune modification. Veuillez modifier votre prénom ou votre nom ou annuler l'action.")
                return false
            }
        }
        // MAJ adresse e-mail :
        if (modalState === MODAL_STATES.UPDATE.USER_EMAIL) {
            // Vérification de changement par rapport à l'existant :
            if (currentUser.email === formObject.email) {
                setErrorMessage("Aucune modification. Veuillez modifier votre email ou annuler l'action.")
                return false
            }
            if (currentUser.email && formObject.email && formObject.pwd) {
                // Réauthentification par Firebase avant changement de l'adresse email :
                const credential = EmailAuthProvider.credential(currentUser.email, formObject.pwd);
                await reauthenticateWithCredential(firebaseUser, credential)
                // Mise à jour avec la nouvelle adresse email :
                await updateEmail (firebaseUser, formObject.email)
                // Envoi de l'email de vérification à la nouvelle adresse email par Firebase :
                await sendEmailVerification(firebaseUser);    
            }
        }
        // MAJ date de naissance :
        if (modalState === MODAL_STATES.UPDATE.USER_BIRTH_DATE) {
            // Vérification de changement par rapport à l'existant :
            const dbDate = currentUser.birth_date?.split("T")[0]
            if (dbDate === formObject.birth_date) {
                setErrorMessage("Aucune modification. Veuillez modifier votre date de naissance ou annuler l'action.")
                return false
            }
        }

        // MAJ role :
        if (modalState === MODAL_STATES.UPDATE.USER_ROLE) {
            // Vérification de changement par rapport à l'existant :
            if (currentUser.role === formObject.role) {
                setErrorMessage("Aucune modification. Veuillez modifier votre rôle ou annuler l'action.")
                return false
            }
        }

        // Récupère et rafraichis le token Firebase actuel :
        const firebaseToken = await firebaseUser.getIdToken(true);
        // Envoi au backend du token pour vérification par Firebase puis mise à jour sur Supabase :
        const response = await fetch (`${backendURL}/updateUser`, {
            method: "PATCH",
            headers: { 
                "Content-Type": "application/json",
                "Authorization": `Bearer ${firebaseToken}`,
            },
            body: JSON.stringify({
                ...(formObject.firstname ? { firstname: formObject.firstname } : {}),
                ...(formObject.lastname ? { lastname: formObject.lastname } : {}),
                ...(formObject.email ? { email: formObject.email } : {}),
                ...(formObject.birth_date ? { birth_date: formObject.birth_date } : 
                    currentUser.birth_date ? 
                        { birth_date: currentUser.birth_date } 
                        : {}
                ),
                originalRole: currentUser.role,
                ...(formObject.newRole ? { newRole: formObject.newRole } : {}),
  
            })
        })

        // Réception de la réponse depuis Supabase :
        const { user } = await response.json();
        return user || false;
    
    } catch (err) {
        const error = err as {code?: string}
        if (error.code === "auth/user-not-found") {setErrorMessage("Veuillez saisir une adresse e-mail et un mot de passe valides.")}
        if (error.code === "auth/email-already-in-use") {setErrorMessage("Une erreur est survenue. Veuillez choisir une autre adresse e-mail.")}
        return false
    }
}