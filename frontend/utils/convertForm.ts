export function convertFormToObject (form: HTMLFormElement) {
    if (!form) return false
    const formData = new FormData (form)
    const formObject = Object.fromEntries(formData.entries()) as Record <string, string>
    return formObject
}