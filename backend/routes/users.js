var express = require('express');
var router = express.Router();
const admin = require("../lib/firebase-admin");
const { dbConnect } = require("../lib/db")

/* SignIn user */
router.post("/signin", async (req, res) => {
  const sql = await dbConnect()
  // Réception du token de Firebase
  const firebaseIdToken = req.headers.authorization?.split("Bearer ")[1];
  const categorie = req.body.categorie
  if (!firebaseIdToken) {
    return res.status(401).json({ error: "No token provided" });
  }
  try {
    // Décodage du token Firebase et récupération de l'UId
    const decodedToken = await admin.auth().verifyIdToken(firebaseIdToken);
    const firebaseUId = decodedToken.uid;
    // Recherche du user dans Supabase
    const supabaseUser = await sql`SELECT * FROM users WHERE firebase_uid = ${firebaseUId} AND categorie = ${categorie}`;
    if (supabaseUser.length === 0) {
      return res.status(404).json({ error: "Utilisateur introuvable. Vérifiez vos identifiants et votre statut" });
    }
    // Mise à jour de la date de dernière connexion
    await sql`UPDATE users SET last_login = NOW() WHERE firebase_uid = ${firebaseUId}`;
    // Renvoi du user mis à jour
    const updatedUser = await sql`SELECT * FROM users WHERE firebase_uid = ${firebaseUId}`
    return res.json({ message: "Token valid", user: updatedUser[0] });
  } catch (error) {
    console.error("Error verifying token:", error);
    res.status(401).json({ error: "Invalid or expired token" });
  }
});

/* Check user */
router.post("/checkCurrentUser", async (req, res) => {
  const sql = await dbConnect()
  const firebaseIdToken = req.headers.authorization?.split("Bearer ")[1];
  if (!firebaseIdToken) {
    return res.status(401).json("Aucun token transmis");
  }
  try {
    const decodedToken = await admin.auth().verifyIdToken(firebaseIdToken);
    const firebaseUId = decodedToken.uid;
    const supabaseUser = await sql`SELECT * FROM users WHERE firebase_uid = ${firebaseUId}`;
    if (supabaseUser.length === 0) {
      return res.status(404).json({ error: "Aucun utilisateur Supabase correspondant." });
    }
    // Met à jour de la date de dernière connexion
    await sql`UPDATE users SET last_login = NOW() WHERE firebase_uid = ${firebaseUId}`;
    // Renvoi du user mis à jour
    const updatedUser = await sql`SELECT * FROM users WHERE firebase_uid = ${firebaseUId}`
    return res.json({ message: "Token valid", user: updatedUser[0] });
  } catch (error) {
    console.error("Erreur lors de la vérification du token:", error);
    res.status(405).json({ error: "Token invalide ou expiré" });
  }
});

/* SignUp user */
router.post("/signup", async (req, res) => {
  const sql = await dbConnect()
  // Réception du token de Firebase
  const firebaseIdToken = req.headers.authorization?.split("Bearer ")[1];
  const { firstname, lastname, email, categorie} = req.body
  // Vérification de l'email non vide
  if (!firstname || !lastname || !email || !categorie) {
    return res.json ({ error: "Informations manquantes" }, { status: 400 });
  }
  if (!firebaseIdToken) {
    return res.status(401).json({ error: "No token provided" });
  }
  try {
    // Décodage du token Firebase et récupération de l'UId
    const decodedToken = await admin.auth().verifyIdToken(firebaseIdToken);
    const firebaseUId = decodedToken.uid;
    // Vérification que l'utilisateur n'existe pas en bdd
    const supabaseUser = await sql`SELECT * FROM users WHERE firebase_uid = ${firebaseUId} AND categorie = ${categorie}`;
    if (supabaseUser.length > 0) {
      return res.status(404).json({ error: "Cet email est déjà utilisé"}, {status : 409} );
    }
    // Création du nouvel utilisateur dans Supabase
    await sql `INSERT INTO users (firstname, lastname, email, categorie, created_at, last_login, firebase_uid)
    VALUES (${firstname}, ${lastname}, ${email}, ${categorie}, NOW(), NOW(), ${firebaseUId})`;
    // Renvoi du user nouvellement créé
    const newUser = await sql `SELECT * FROM users WHERE firebase_uid = ${firebaseUId}`
    return res.json(newUser[0]);
  } catch (error) {
    console.error("Erreur lors de la création du nouvel utilisateur :", error);
    res.status(401).json({ error: "Erreur serveur" }, {status : 500});
  }
});


module.exports = router;
