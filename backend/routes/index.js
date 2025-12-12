var express = require('express');
var router = express.Router();
const { dbConnect } = require("../lib/db")

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* Route simple pour tester la connexion à la db */
router.get("/roles", async (req, res) => {
  const sql = await dbConnect()
  try {
    const roles = await sql`SELECT * FROM roles ORDER BY label ASC`
    return res.status(200).json(roles);
  }
  catch (error) {
    console.error("Erreur lors de l'affichage des roles : ", error);
    res.status(500).json({ error: "Erreur serveur." });
  }
})


module.exports = router;
