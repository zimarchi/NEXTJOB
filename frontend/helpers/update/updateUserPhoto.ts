import { getAuth, User } from "firebase/auth";

const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL
const auth = getAuth();
const firebaseUser: User | null = auth.currentUser;

export async function updateUserPhoto (
    user_photo_url: string | null,
) {
    if (!firebaseUser) {
        return false
    }
    
    try {
        // Récupère et rafraichis le token Firebase actuel :
        const firebaseToken = await firebaseUser.getIdToken(true);
        // Envoi au backend du token pour vérification par Firebase puis mise à jour dans Supabase :
        const response = await fetch (`${backendURL}/updateUser`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${firebaseToken}`,
            },
            body : JSON.stringify ({
                user_photo_url : user_photo_url 
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