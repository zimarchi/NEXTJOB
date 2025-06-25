import { USER_ROLE_CANDIDAT, USER_ROLE_RECRUTEUR } from "./usersRoles"

export const SIGN_IN_INPUTS : Record <string,string>[] = 
    [
        {   label : "Adresse e-mail", type : "email", placeholder : "nom@example.com", id: "email", name: "email" },
        {   label : "Mot de passe", type : "password", placeholder : "mot de passe", id: "pwd", name: "pwd" },
    ]

export const SIGN_UP_INPUTS : Record <string,string>[] = 
    [
        {   label : "Prénom", type : "text", placeholder : "Prénom", id: "firstname", name: "firstname" },
        {   label : "Nom",type : "text", placeholder : "NOM", id: "lastname", name: "lastname" },
        {   label : "Adresse e-mail", type : "email", placeholder : "nom@example.com", id: "email", name: "email" },
        {   label : "Mot de passe", type : "password", placeholder : "mot de passe", id: "pwd", name: "pwd" },
        {   label : "Répétez votre mot de passe", type : "password", placeholder : "mot de passe", id: "rptpwd", name: "rptpwd" },
    ]

export const USERS_ROLES_RADIO_BUTTONS : Record <string,string>[] = 
    [
        {   label : USER_ROLE_RECRUTEUR, type : "radio", value: USER_ROLE_RECRUTEUR, id: USER_ROLE_RECRUTEUR, name: "role" },
        {   label : USER_ROLE_CANDIDAT, type : "radio", value: USER_ROLE_CANDIDAT, id: USER_ROLE_CANDIDAT, name: "role" },
    ]

export const UPDATE_PASSWORD_INPUTS : Record <string,string>[] = 
    [
        {   label : "Adresse e-mail", type : "email", placeholder : "nom@example.com", id: "email", name: "email" },
    ]

export const UPDATE_USER_FULL_NAME_INPUTS : Record <string,string>[] = 
    [
        {   label : "Prénom", type : "text", placeholder : "Prénom", id: "firstname", name: "firstname" },
        {   label : "Nom",type : "text", placeholder : "NOM", id: "lastname", name: "lastname" },
    ]

export const UPDATE_USER_EMAIL_INPUTS : Record <string,string>[] = 
    [
        {   label : "Mot de passe", type : "password", placeholder : "mot de passe", id: "pwd", name: "pwd" },
        {   label : "Nouvelle adresse e-mail", type : "email", placeholder : "nom@example.com", id: "email", name: "email" },
    ]

export const UPDATE_USER_BIRTH_DATE_INPUTS : Record <string,string>[] = 
    [
        {   label : "Date de naissance", type : "date", id: "birth_date", name: "birth_date", min: "1900-01-01" },
    ]

export const UPDATE_USER_PHOTO_INPUTS : Record <string,string>[] = 
    [
        {   type : "file", name : "avatar", accept : "image/*", id: "userPhoto" },
    ]

export const UPDATE_USER_ROLE_INPUTS : Record <string,string>[] = 
    [
        {   label : "Rôle", type : "select", id: "newRole", name: "newRole", 
            option1: USER_ROLE_RECRUTEUR,
            option2: USER_ROLE_CANDIDAT, 
        },
    ]

export const DELETE_USER_ACCOUNT_INPUTS : Record <string,string>[] = 
    [
        {   label : "Mot de passe", type : "password", placeholder : "mot de passe", id: "pwd", name: "pwd" },
    ]