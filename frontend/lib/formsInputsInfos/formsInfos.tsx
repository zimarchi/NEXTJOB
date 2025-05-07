export const signInInputsInfos: Record <string,string>[] = 
    [
        {   label : "Adresse email", type : "email", placeholder : "nom@example.com", id: "email" },
        {   label : "Mot de passe", type : "password", placeholder : "mot de passe", id: "pwd"},
    ]

export const signUpInputsInfos: Record <string,string>[] = 
    [
        {   label : "Prénom", type : "text", placeholder : "Prénom", id: "firstname", },
        {   label : "Nom",type : "text", placeholder : "NOM", id: "lastname",},
        {   label : "Adresse email", type : "email", placeholder : "nom@example.com", id: "email",},
        {   label : "Mot de passe", type : "password", placeholder : "mot de passe", id: "pwd"},
        {   label : "Répétez votre mot de passe", type : "password", placeholder : "mot de passe", id: "rptpwd" },
    ]

export const recruteurCandidatRadioButtonsInfos: Record <string,string>[] = 
    [
        {   label : "Recruteur", type : "radio", value: "categorie", id: "recruteur"},
        {   label : "Candidat",type : "radio", value: "categorie", id: "candidat" },
    ]

export const passwordInfos: Record <string,string>[] = 
    [
        {   label : "Adresse email", type : "email", placeholder : "nom@example.com", id: "email" },
    ]

export const updateUserFullName: Record <string,string>[] = 
    [
        {   label : "Prénom", type : "text", placeholder : "Prénom", id: "firstname", },
        {   label : "Nom",type : "text", placeholder : "NOM", id: "lastname",},
    ]

export const updateUserBirthDate: Record <string,string>[] = 
    [
        {   label : "Date de naissance", type : "texte", placeholder : "jj/mm/aaaa", id: "birthdate", },
    ]

export const updateUserProfilePhoto: Record <string,string>[] = 
    [
        {   type : "file", name : "avatar", accept : "image/*", id: "userPhoto" },
    ]
