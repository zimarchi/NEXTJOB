import { supabase } from "@/lib/supabase/supabase";
import {v4 as uuidv4} from "uuid"

export async function uploadUserPhoto (
  file: File,
  firebaseUId: string,
) {

  // Création de l'url de la nouvelle photo
  const fileExt = file.name.split('.').pop( );
  const randomId = uuidv4();
  const filePath = `${firebaseUId}/${randomId}.${fileExt}`;

  // Téléversement de la photo dans storage Supabase
  const { error } = await supabase.storage
    .from("users-photos")
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: true,
    });

  if (error) {
    console.error("Erreur upload:", error);
    return false;
  }

  const { data } = supabase.storage.from("users-photos").getPublicUrl(filePath);
  return data?.publicUrl || null;
}