import { supabase } from "@/lib/supabase/supabase";

export async function deleteUserPhoto (
    user_photo_url: string,
) {
    // Supprimer la photo du storage supabase 
    const url = new URL(user_photo_url);
    const bucketBasePath = "/storage/v1/object/public/users-photos/"
    const filePath = url.pathname.replace(bucketBasePath, "")
    const { error } = await supabase.storage.from("users-photos").remove([filePath]);
    if (error) {
        console.error ("Erreur lors de la suppression de la photo : ", error)
        return false
    }
    return true;
}