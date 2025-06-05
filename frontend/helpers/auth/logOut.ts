import { signOut } from "firebase/auth";
import { auth } from "../../lib/firebase/firebase-config";

export async function logOut () {
    try {
        const cred = await signOut (auth)
        console.log("Utilisateur déconnecté : ", cred)
        return (cred)
    }
    catch (err) {
        console.error("Problème lors de la déconnexion", err)
        return false
    }

}