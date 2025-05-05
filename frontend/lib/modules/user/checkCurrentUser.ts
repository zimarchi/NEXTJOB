export default async function checkCurrentUser (firebaseUser) {
    if (!firebaseUser) return false
    try {
        // Récupère et rafraichis le token Firebase actuel :
        const firebaseIdToken = await firebaseUser.getIdToken(true);
        // Envoi au backend du token pour vérification par Firebase :
        const response = await fetch ("http://localhost:3000/users/checkCurrentUser", {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "Authorization": `Bearer ${firebaseIdToken}`,
            },
        });
        // Réception de la réponse depuis Supabase :
        const data = await response.json();
        if (data.status === 401) {
            console.log ("Aucun utilisateur connecté")
            return false
        }
        if (data.status === 404) {
            console.error ("Erreur : Aucun utilisateur correspondant")
            return false
        }
        if (data.status === 405) {
            console.error (data.error)
            return false
        }
        // Renvoie le currentUser en front pour mise à jour dans le contexte :
        return (data.user)
        
    } catch (error) {
        console.error("Erreur lors de la vérification du token ou de la récupération de l'utilisateur :", error);
        return false
    }
}