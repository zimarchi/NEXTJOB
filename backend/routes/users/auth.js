var express = require('express');
var router = express.Router();
const { dbConnect } = require("../../lib/db")
const { getAuthenticatedUser } = require("../../lib/authenticate")


/* SignIn user */
router.post("/signin", async (req, res) => {
  const sql = await dbConnect()
  // Réception du token de Firebase
  const firebaseToken = req.headers.authorization?.split("Bearer ")[1];
  const role = req.body.role
  if (!firebaseToken) {
    return res.status(401).json({ error: "No token provided." });
  }
  try {
    // Utilisation de la fonction getAuthenticatedUser pour récupérer l'utilisateur
    const { decodedFirebaseToken, firebaseUId, supabaseUser } = await getAuthenticatedUser(sql, firebaseToken, role);
    if (!decodedFirebaseToken.email_verified) {
      return res.status(403).json({ error: "Veuillez valider votre adresse e-mail avant de vous connecter." });
    }
    if (supabaseUser.length === 0) {
      return res.status(404).json({ error: "Utilisateur introuvable. Vérifiez votre rôle et/ou vos identifiants." });
    }
    // Mise à jour de la date de dernière connexion
    await sql`UPDATE users SET last_login = NOW() WHERE firebase_uid = ${firebaseUId}`;
    // Renvoi du user mis à jour
    const updatedUser = await sql`SELECT * FROM users WHERE firebase_uid = ${firebaseUId}`
    return res.status(200).json({ message: "Token valid", user: updatedUser[0] });
  } catch (error) {
    console.error("Error verifying token: ", error);
    res.status(401).json({ error: "Invalid or expired token." });
  }
});

/* SignUp user */
router.post("/signup", async (req, res) => {
  const sql = await dbConnect()
  // Réception du token de Firebase
  const firebaseToken = req.headers.authorization?.split("Bearer ")[1];
  const { firstname, lastname, email, role } = req.body
  // Vérification de l'email non vide
  if (!firstname || !lastname || !email || !role) {
    return res.json({ error: "Informations manquantes." }, { status: 400 });
  }
  if (!firebaseToken) {
    return res.status(401).json({ error: "No token provided." });
  }
  try {
    // Utilisation de la fonction getAuthenticatedUser pour récupérer l'utilisateur
    const { firebaseUId, supabaseUser } = await getAuthenticatedUser(sql, firebaseToken, role);
    // Vérification que l'utilisateur n'existe pas en bdd
    if (supabaseUser.length > 0) {
      return res.status(409).json({ error: "Cette adresse e-mail est déjà utilisée." });
    }
    // Création du nouvel utilisateur dans Supabase
    await sql`INSERT INTO users (firstname, lastname, email, role, created_at, last_login, firebase_uid)
    VALUES (${firstname}, ${lastname}, ${email}, ${role}, NOW(), NOW(), ${firebaseUId})`;
    // Renvoi du user nouvellement créé
    const newUser = await sql`SELECT * FROM users WHERE firebase_uid = ${firebaseUId}`
    return res.json(newUser[0]);
  } catch (error) {
    console.error("Erreur lors de la création du nouvel utilisateur : ", error);
    res.status(500).json({ error: "Erreur serveur." });
  }
});


module.exports = router;
