import { supabase } from "@/lib/supabase/supabase";

export async function deleteUserPhoto (
    user_photo_url: string,
) {
    // Supprimer la photo du storage supabase 
    const url = new URL(user_photo_url);
    const parts = url.pathname.split("/");
    const fileName = parts[parts.length - 1]; // "xrIFnv8rX7WltvnbWnMQ8F7b9BY2.jpg"
    const { data, error } = await supabase.storage.from("users-photos2").remove([fileName]);
    if (error) {
        console.error ("Error when trying to delete file : ", error)
        return false
    }
    return data;
}