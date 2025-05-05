import { signOut } from "firebase/auth";
import { auth } from "../../firebase/firebase-config";

export async function logOut (currentUser: Record <string, string>) {

    console.log("avant déconnexion", currentUser)

    try {
        const cred = await signOut (auth)
        console.log("Utilisateur déconnecté : ", cred)
        return (cred)
    }
    catch (err: any) {
        console.error("Problème lors de la déconnexion", err)
        return false
    }

}