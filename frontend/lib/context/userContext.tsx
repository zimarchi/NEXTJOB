"use client"

import { createContext, useState, useEffect, useContext } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "../firebase/firebase-config";
import checkCurrentUser from "../modules/user/checkCurrentUser";

type UserContextType = {
    modalState: string | null,
    toggleModals: (modal: string)=> void,
    firebaseUser: User | null,
    completedInfosFromAuthForm: Record <string, string>,
    currentUser: Record <string, string>,
    loading : boolean,
    updateCurrentUser: (currentUser: Record <string, string>)=> void,
}

export const UserContext =  createContext <UserContextType | null> (null)

export function UserContextProvider ({children} : {children: React.ReactNode}) {
    
    const [modalState, setModalState] = useState ("close")

    const toggleModals = (modal:string) => {
        if (modal === "signin")             { setModalState("signin") }
        if (modal === "signup")             { setModalState("signup") }
        if (modal === "close")              { setModalState("close") }
        if (modal === "monCompte")          { setModalState("monCompte") }
        if (modal === "updatePwd")          { setModalState("updatePwd") }
        if (modal === "updateFullName")     { setModalState("updateFullName") }
        if (modal === "updateProfilePhoto") { setModalState("updateProfilePhoto") }
        if (modal === "updateBirthDate")    { setModalState("updateBirthDate") }
    }

    const [loading, setLoading] = useState (true)

    const [firebaseUser, setFirebaseUser] = useState <User | null> (null)

    const [completedInfosFromAuthForm] = useState ({})

    const [currentUser, setCurrentUser] = useState ({})

    const updateCurrentUser = (object: Record<string, string>) => {
        setCurrentUser (object)
    }

    useEffect (() => {
        const unsubscribe = onAuthStateChanged (auth, async (firebaseUser) => {
            setFirebaseUser (firebaseUser)
            if (firebaseUser) {
                const user = await checkCurrentUser(firebaseUser);
                if (user) {
                    updateCurrentUser (user);
                    setLoading (false)
                }
            } 
            if (!firebaseUser && !loading) {
                updateCurrentUser({})
            }
        })
        return unsubscribe
    }, [loading])

    return (
        <UserContext.Provider value = {{ modalState, toggleModals, loading, firebaseUser, completedInfosFromAuthForm, currentUser, updateCurrentUser }} >
            {children}
        </UserContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(UserContext);
    if (!context) {
      throw new Error("useAuth must be used within a UserContextProvider");
    }
    return context;
};