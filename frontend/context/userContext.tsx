"use client"

import { createContext, useState, useEffect, useContext } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "../lib/firebase/firebase-config";
import checkUser from "../helpers/checkUser";
import { formatDateLong, formatDateShort } from "@/utils/formatDate";
import { MODAL_STATES } from "@/constants/modalStates";

type UserContextType = {
    modalState: string,
    toggleModals: (modal: string)=> void,
    firebaseUser: User | null,
    currentUser: Record <string, string | undefined> | null,
    loading : boolean,
    updateCurrentUser: (currentUser: Record <string, string> | null) => void,
    formattedBirthDateLong: string,
    formattedBirthDateShort: string,
}

export const UserContext =  createContext <UserContextType | null> (null)

export function UserContextProvider ({children} : {children: React.ReactNode}) {
    
    const [modalState, setModalState] = useState (MODAL_STATES.CLOSE)

    const toggleModals = (modal:string) => setModalState(modal)

    const [loading, setLoading] = useState (true)

    const [firebaseUser, setFirebaseUser] = useState <User | null> (null)

    const [currentUser, setCurrentUser] = useState<Record<string, string> | null> (null)
    const updateCurrentUser = (object: Record<string, string> | null) => {
        setCurrentUser (object)
    }

    const [formattedBirthDateLong, setFormattedDateLong] = useState ("")
    const [formattedBirthDateShort, setFormattedDateShort] = useState ("")

    useEffect (() => {
        const unsubscribe = onAuthStateChanged (auth, async (firebaseUser) => {
            setFirebaseUser (firebaseUser)
            if (firebaseUser) {
                const user = await checkUser(firebaseUser);
                if (user) updateCurrentUser (user)
            } 
            if (!firebaseUser) updateCurrentUser(null)
            if (currentUser?.birth_date) {
                const longDate = formatDateLong(currentUser.birth_date)
                setFormattedDateLong(longDate)
                const shortDate = formatDateShort(currentUser.birth_date)
                setFormattedDateShort(shortDate)
            }
            setLoading (false)
        })
        return unsubscribe
    }, [loading, currentUser?.birth_date, currentUser?.role])

    return (
        <UserContext.Provider value = {{ modalState, toggleModals, loading, firebaseUser, currentUser, updateCurrentUser, formattedBirthDateLong, formattedBirthDateShort }} >
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