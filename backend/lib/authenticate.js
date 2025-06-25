const admin = require("./firebase-admin")

async function getAuthenticatedUser(sql, firebaseToken, originalRole = null) {

    if (!firebaseToken) {
      throw { code: 401, message: "No token provided." };
    }
    const decodedFirebaseToken = await admin.auth().verifyIdToken(firebaseToken);
    
    const firebaseUId = decodedFirebaseToken.uid;

    const query = originalRole
      ? sql`SELECT * FROM users WHERE firebase_uid = ${firebaseUId} AND role = ${originalRole}`
      : sql`SELECT * FROM users WHERE firebase_uid = ${firebaseUId}`;
  
    const supabaseUser = await query;
  
    return { decodedFirebaseToken, firebaseUId, supabaseUser };

}

module.exports = {getAuthenticatedUser}