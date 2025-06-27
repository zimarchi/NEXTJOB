import { useAuth } from "@/context/userContext";
import { MODAL_STATES } from "@/constants/modalStates";
import { useState } from "react";
import Fieldset from "@/components/forms/formFieldset";
import { DELETE_USER_ACCOUNT_INPUTS } from "@/constants/formsInfos";
import { deleteUserAccount } from "@/helpers/delete/deleteUserAccount";
import { useRouter } from "next/navigation";

export default function UserAccountDeleteModal() {
  
    const router = useRouter();

    // Etat pour délai soumission :
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Etats via useContext :
    const { toggleModals, updateCurrentUser, firebaseUser, currentUser } = useAuth()

    // Confirmation de suppression :
    const [deleteIsConfirmed, setDeleteIsConfirmed] = useState (false) 

    // Message d'erreur en bas du formulaire :
    const [formErrorMessage, setFormErrorMessage] = useState("")

    // Gestion de la validation du formulaire :
    const handleDeleteUserAccount = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsSubmitting(true)
        // Vérification de l'état de la connexion :
        if (firebaseUser && currentUser) {
            // Suppression de l'utilisateur :
            const deleteUserSuccess = await deleteUserAccount (
                e.currentTarget,
                currentUser,
                setFormErrorMessage,
            )
            if (deleteUserSuccess) {
                updateCurrentUser(null)
                toggleModals (MODAL_STATES.CLOSE)
                router.push("/")
            }
        }
        setIsSubmitting(false)
    }

    return (

    <div className="modalPage modalPageColor" onClick={() => {
        toggleModals (MODAL_STATES.CLOSE)
        if (!firebaseUser) {
        updateCurrentUser(null)
        }
    }}
    >
        <section className="modal" role="dialog" aria-modal="true" aria-labelledby="delete-account-modal-title" onClick={(e) => e.stopPropagation()}>
            <h3 id="update-modal-title">Supprimez votre compte</h3>
            <p className="modalText">{deleteIsConfirmed ? "Pour pouvoir supprimer votre compte, vous devez saisir votre mot de passe :" : "Etes-vous sur de vouloir supprimer votre compte ? Cette action est irréversible."}</p>
            <form className="userForm" onSubmit={handleDeleteUserAccount}>
                { deleteIsConfirmed &&
                <Fieldset
                    fieldsetStyle="textFieldset"
                    labelStyle="textFieldLabel"
                    legend="Supprimez votre compte"
                    infos= {DELETE_USER_ACCOUNT_INPUTS}
                />
                }
                <div className="buttonsLine">
                    <button className="resetButton" type="reset" onClick={() => toggleModals(MODAL_STATES.CLOSE)}>Annuler</button>
                    {!deleteIsConfirmed ? 
                    <button className={`submitButton ${isSubmitting ? "disabledButton" : "dangerButtonBackgroundColor"}`} disabled = {isSubmitting} onClick = {()=> setDeleteIsConfirmed(true) }>
                        Oui
                    </button> 
                    :
                    <button className={`submitButton ${isSubmitting ? "disabledButton" : "dangerButtonBackgroundColor"}`} disabled = {isSubmitting} type="submit">
                        Supprimer mon compte
                    </button>
                    }
                </div>
                {formErrorMessage.length > 0 &&
                <span className="errorMessages">
                    {formErrorMessage}
                </span>
                }
            </form>
        </section>


    </div>
  )
}
