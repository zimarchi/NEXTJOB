import postgres from 'postgres'

export async function dbConnect () {
    const connectionString = process.env.DATABASE_URL
    if (!connectionString) {
        throw new Error ("❌ DATABASE_URL n'est pas définie. Vérifiez votre fichier .env")
    }
    
    let sql
    try {
        sql = postgres (connectionString, { ssl: "require" });
        console.log("✅ Connexion à la base de données PostgreSQL Supabase réussie.")
        return sql
    } 
    catch (error) {
        console.error("❌ Erreur de connexion à la base de données :", error)
        throw error
    }
}