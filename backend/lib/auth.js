const admin = require("./firebase-admin")

async function getAuthenticatedUser(sql, firebaseToken, categorie = null) {

    if (!firebaseToken) {
      throw { code: 401, message: "No token provided." };
    }
    const decodedFirebaseToken = await admin.auth().verifyIdToken(firebaseToken);
    const firebaseUId = decodedFirebaseToken.uid;

    const query = categorie
      ? sql`SELECT * FROM users WHERE firebase_uid = ${firebaseUId} AND categorie = ${categorie}`
      : sql`SELECT * FROM users WHERE firebase_uid = ${firebaseUId}`;
  
    const supabaseUser = await query;
  
    return { firebaseUId, supabaseUser };

}

module.exports = {getAuthenticatedUser}