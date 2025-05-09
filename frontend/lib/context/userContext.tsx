"use client"

import { createContext, useState, useEffect, useContext } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "../firebase/firebase-config";
import checkCurrentUser from "../modules/user/checkCurrentUser";
import { formatDateLong, formatDateShort } from "@/lib/modules/formatDate";

type ModalType =
        |"close"
        | "signup"
        | "signin"
        | "password"
        | "monCompte"
        | "updateFullName"
        | "updateProfilePhoto"
        | "updateBirthDate";

type UserContextType = {
    modalState: string,
    toggleModals: (modal: ModalType)=> void,
    firebaseUser: User | null,
    completedInfosFromForm: Record <string, string>,
    currentUser: Record <string, string | undefined>,
    loading : boolean,
    updateCurrentUser: (currentUser: Record <string, string>)=> void,
    formattedBirthDateLong: string,
    formattedBirthDateShort: string,
}

interface CurrentUser {
    [key: string]: string | undefined;
  }

export const UserContext =  createContext <UserContextType | null> (null)

export function UserContextProvider ({children} : {children: React.ReactNode}) {
    
    const [modalState, setModalState] = useState ("close")

    const toggleModals = (modal:ModalType) => setModalState(modal)

    const [loading, setLoading] = useState (true)

    const [firebaseUser, setFirebaseUser] = useState <User | null> (null)

    const [completedInfosFromForm] = useState ({})

    const [currentUser, setCurrentUser] = useState <CurrentUser> ({})

    const updateCurrentUser = (object: Record<string, string>) => {
        setCurrentUser (object)
    }

    const [formattedBirthDateLong, setFormattedDateLong] = useState ("")
    const [formattedBirthDateShort, setFormattedDateShort] = useState ("")

    useEffect (() => {
        const unsubscribe = onAuthStateChanged (auth, async (firebaseUser) => {
            setFirebaseUser (firebaseUser)
            if (firebaseUser) {
                const user = await checkCurrentUser(firebaseUser);
                if (user) updateCurrentUser (user)
            } 
            if (!firebaseUser) updateCurrentUser({})
            if (currentUser.birth_date) {
                const longDate = formatDateLong(currentUser.birth_date)
                setFormattedDateLong(longDate)
                const shortDate = formatDateShort(currentUser.birth_date)
                setFormattedDateShort(shortDate)
            }
            setLoading (false)
        })
        return unsubscribe
    }, [loading, currentUser.birth_date])

    return (
        <UserContext.Provider value = {{ modalState, toggleModals, loading, firebaseUser, completedInfosFromForm, currentUser, updateCurrentUser, formattedBirthDateLong, formattedBirthDateShort }} >
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