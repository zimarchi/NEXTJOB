import { USER_ROLE_CANDIDAT, USER_ROLE_RECRUTEUR } from "./usersRoles"

export const SIGN_IN_INPUTS : Record <string,string>[] = 
    [
        {   label : "Adresse email", type : "email", placeholder : "nom@example.com", id: "email" },
        {   label : "Mot de passe", type : "password", placeholder : "mot de passe", id: "pwd"},
    ]

export const SIGN_UP_INPUTS : Record <string,string>[] = 
    [
        {   label : "Prénom", type : "text", placeholder : "Prénom", id: "firstname", },
        {   label : "Nom",type : "text", placeholder : "NOM", id: "lastname",},
        {   label : "Adresse email", type : "email", placeholder : "nom@example.com", id: "email",},
        {   label : "Mot de passe", type : "password", placeholder : "mot de passe", id: "pwd"},
        {   label : "Répétez votre mot de passe", type : "password", placeholder : "mot de passe", id: "rptpwd" },
    ]

export const USERS_ROLES_RADIO_BUTTONS : Record <string,string>[] = 
    [
        {   label : USER_ROLE_RECRUTEUR, type : "radio", value: "role", id: USER_ROLE_RECRUTEUR},
        {   label : USER_ROLE_CANDIDAT, type : "radio", value: "role", id: USER_ROLE_CANDIDAT },
    ]

export const UPDATE_PASSWORD_INPUTS : Record <string,string>[] = 
    [
        {   label : "Adresse email", type : "email", placeholder : "nom@example.com", id: "email" },
    ]

export const UPDATE_USER_FULL_NAME_INPUTS : Record <string,string>[] = 
    [
        {   label : "Prénom", type : "text", placeholder : "Prénom", id: "firstname", },
        {   label : "Nom",type : "text", placeholder : "NOM", id: "lastname",},
    ]

export const UPDATE_USER_BIRTH_DATE_INPUTS : Record <string,string>[] = 
    [
        {   label : "Date de naissance", type : "texte", placeholder : "jj/mm/aaaa", id: "birthdate", },
    ]

export const UPDATE_USER_PROFILE_PHOTO_INPUTS : Record <string,string>[] = 
    [
        {   type : "file", name : "avatar", accept : "image/*", id: "userPhoto" },
    ]
