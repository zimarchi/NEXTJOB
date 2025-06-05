import { User } from "firebase/auth"

const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL

export default async function checkUser (firebaseUser: User) {
    if (!firebaseUser) return false
    try {
        // Récupère et rafraichis le token Firebase actuel :
        const firebaseToken = await firebaseUser.getIdToken(true);
        // Envoi au backend du token pour vérification par Firebase puis par Supabase :
        const response = await fetch (`${backendURL}/checkUser`, {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "Authorization": `Bearer ${firebaseToken}`,
            },
        });
        // Réception de la réponse depuis Supabase :
        const data = await response.json();
        // Renvoi du currentUser en front pour mise à jour dans le contexte :
        return (data.user)
        
    } catch (error) {
        console.error("Erreur lors de la vérification du token ou de la récupération de l'utilisateur :", error);
        return false
    }
}