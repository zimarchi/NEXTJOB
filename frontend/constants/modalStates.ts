export const MODAL_STATES = 
{
    CLOSE : "close",
    SIGN_IN : "signin",
    SIGN_UP : "signup",
    PASSWORD : "pwd",
    MON_COMPTE : "monCompte",
    UPDATE : {
        USER_FULL_NAME : "updateUserFullName",
        USER_BIRTH_DATE : "updateUserBirthDate",
        USER_PHOTO : "updateUserPhoto",
        USER_EMAIL : "updateUserEmail",
        USER_ROLE : "updateUserRole",
    },
    DELETE : {
        USER_PHOTO : "deleteUserPhoto",
        USER_ACCOUNT : "deleteUserAccount",
    },
    EMAIL_CONFIRMATION : {
        SIGN_UP : "emailConfirmationAfterSignup",
        UPDATE : "emailconfirmationAfterUpdate",
    }   
}