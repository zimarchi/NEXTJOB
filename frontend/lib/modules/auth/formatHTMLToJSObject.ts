export function formatFromHTMLFormToJSObject (HTMLForm: unknown, JSObject: Record <string, string>) {

  // Remplissage de JSObject
  for (let i=0; i<HTMLForm.current.length; i++) {
    if (HTMLForm.current[i].checked) {
      JSObject.categorie = HTMLForm.current[i].id
    }
    if (HTMLForm.current[i].id !== "recruteur" && HTMLForm.current[i].id !== "candidat") {
      JSObject [HTMLForm.current[i].id] = HTMLForm.current[i].value
    }
  }
  
}