export function formatFromHTMLFormToJSObject (HTMLForm: React.RefObject<HTMLFormElement>, JSObject: Record <string, string>) {

  if (!HTMLForm.current) return;

  // Remplissage de JSObject
  for (let i=0; i<HTMLForm.current.length; i++) {
    const element = HTMLForm.current[i] as HTMLInputElement
    if (element.checked) {
      JSObject.categorie = HTMLForm.current[i].id
    }
    if (element.id !== "recruteur" && element.id !== "candidat") {
      JSObject [element.id] = element.value
    }
  }
  
}