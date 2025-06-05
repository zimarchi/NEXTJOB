import { USER_ROLE_CANDIDAT, USER_ROLE_RECRUTEUR } from "@/constants/usersRoles";

export function formatFromHTMLFormToJSObject (HTMLForm: React.RefObject<HTMLFormElement>, JSObject: Record <string, string>) {

  if (!HTMLForm.current) return;

  // Remplissage de JSObject
  for (let i=0; i<HTMLForm.current.length; i++) {
    const element = HTMLForm.current[i] as HTMLInputElement
    if (element.checked) {
      JSObject.role = HTMLForm.current[i].id
    }
    if (element.id !== USER_ROLE_CANDIDAT && element.id !== USER_ROLE_RECRUTEUR) {
      JSObject [element.id] = element.value
    }
  }
  
}