import { supabase } from "@/lib/supabase/supabase";
import { deleteUserPhoto } from "../delete/deleteUserPhoto";

export async function uploadUserPhoto (
  file: File,
  firebaseUId: string,
  existingUserPhotoUrl: string | undefined,
) {
  
  
  // Supprimer l'ancienne photo si elle existe
  if (existingUserPhotoUrl) {    
    await deleteUserPhoto (existingUserPhotoUrl)
  }

  // Création de l'url de la nouvelle photo
  const fileExt = file.name.split('.').pop( );
  const filePath = `${firebaseUId}.${fileExt}`;

  // Téléversement de la photo dans storage Supabase
  const { error } = await supabase.storage
    .from("users-photos2")
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: true,
    });

  if (error) {
    console.error("Erreur upload:", error);
    return false;
  }

  const { data } = supabase.storage.from("users-photos2").getPublicUrl(filePath);
  return data?.publicUrl || null;
}