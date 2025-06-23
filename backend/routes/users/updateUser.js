var express = require('express');
var router = express.Router();
const { dbConnect } = require("../../lib/db")
const { getAuthenticatedUser } = require("../../lib/authenticate")

/* Update user */
router.post("/", async (req, res) => {
  const sql = await dbConnect()
  const firebaseToken = req.headers.authorization?.split("Bearer ")[1];

  const { firstname, lastname, email, birth_date, user_photo_url } = req.body;
  const fieldsToUpdate = {};
  if (firstname !== undefined) fieldsToUpdate.firstname = firstname;
  if (lastname !== undefined) fieldsToUpdate.lastname = lastname;
  if (email !== undefined) fieldsToUpdate.email = email;
  if (birth_date !== undefined) fieldsToUpdate.birth_date = birth_date;
  if (user_photo_url !== undefined) fieldsToUpdate.user_photo_url = user_photo_url;

  if (!firebaseToken) {
    return res.status(401).json({ error: "No token provided." });
  }

  try {
    // Utilisation de la fonction getAuthenticatedUser pour récupérer l'utilisateur
    const { firebaseUId, supabaseUser } = await getAuthenticatedUser(sql, firebaseToken, role = null);
    if (supabaseUser.length === 0) {
      return res.status(404).json({ error: "Aucun utilisateur Supabase correspondant." });
    }
    // Mise à jour du user
    await sql`UPDATE users2 SET ${sql(fieldsToUpdate)} WHERE firebase_uid = ${firebaseUId}`;
    // Renvoi du user mis à jour
    const updatedUser = await sql`SELECT * FROM users2 WHERE firebase_uid = ${firebaseUId}`
    return res.status(200).json({ message: "Token valid", user: updatedUser[0] });
  
  } catch (error) {
    console.error("Erreur lors de la vérification du token:", error);
    res.status(401).json({ error: "Invalid or expired token." });
  }

});

module.exports = router;
