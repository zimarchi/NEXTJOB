var express = require('express');
var router = express.Router();
const { dbConnect } = require("../../lib/db")
const { getAuthenticatedUser } = require("../../lib/auth")

/* Update user */
router.post("/", async (req, res) => {
  const sql = await dbConnect()
  const firebaseToken = req.headers.authorization?.split("Bearer ")[1];
  const { firstname, lastname } = req.body
  if (!firebaseToken) {
    return res.status(401).json({ error: "No token provided." });
  }
  try {
    // Utilisation de la fonction getAuthenticatedUser pour récupérer l'utilisateur
    const { firebaseUId, supabaseUser } = await getAuthenticatedUser(sql, firebaseToken, categorie = null);
    if (supabaseUser.length === 0) {
      return res.status(404).json({ error: "Aucun utilisateur Supabase correspondant." });
    }
    // Met à jour de la date de dernière connexion
    await sql`UPDATE users SET firstname = ${firstname}, lastname = ${lastname}, last_login = NOW() WHERE firebase_uid = ${firebaseUId}`;
    // Renvoi du user mis à jour
    const updatedUser = await sql`SELECT * FROM users WHERE firebase_uid = ${firebaseUId}`
    return res.status(200).json({ message: "Token valid", user: updatedUser[0] });
  } catch (error) {
    console.error("Erreur lors de la vérification du token:", error);
    res.status(401).json({ error: "Invalid or expired token." });
  }
});

module.exports = router;
