var express = require('express');
var router = express.Router();
const { dbConnect } = require("../../lib/db")
const { getAuthenticatedUser } = require("../../lib/authenticate")

/* Delete user account */
router.delete("/", async (req, res) => {

    const sql = await dbConnect()
    const firebaseToken = req.headers.authorization?.split("Bearer ")[1];

    if (!firebaseToken) {
        return res.status(401).json({ error: "No token provided." });
    }

    try {
        // Utilisation de la fonction getAuthenticatedUser pour récupérer l'utilisateur :
        const { firebaseUId, supabaseUser } = await getAuthenticatedUser(sql, firebaseToken, null);
        if (supabaseUser.length === 0) {
            return res.status(404).json({ error: "Aucun utilisateur Supabase correspondant." });
        }
        // Suppression du user dans Supabase :
        await sql`DELETE FROM users WHERE firebase_uid = ${firebaseUId}`;
        // Vérification que le user a bien été supprimé :
        const usersList = await sql`SELECT * FROM users WHERE firebase_uid = ${firebaseUId}`
        if (usersList.length === 0) {
            return res.status(200).json({ message: "User deleted", userDeleted : true});
        }
        return res.status(500).json({ message: "Erreur lors de la suppression de l'utilisateur."})
  
    } catch (error) {
        console.error("Erreur lors de la suppression de l'utilisateur : ", error);
        res.status(500).json({ error: "Erreur lors de la suppression de l'utilisateur." });
    }

})

module.exports = router