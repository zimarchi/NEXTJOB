import { useAuth } from "@/context/userContext";
import Image from "next/image";
import Logo from "../../logo/logo";
import styles from "./monCompteModal.module.css";
import Link from "next/link";
import { logOut } from "@/helpers/auth/logOut";
import { useRouter } from "next/navigation";
import UserRoleLabel from "@/components/usersRolesLabels/userRoleLabel";
import { MODAL_STATES } from "@/constants/modalStates";

export default function MonCompteModale() {

    const router = useRouter ()

    // Etats via useContext
    const { toggleModals, modalState, currentUser, updateCurrentUser, firebaseUser } = useAuth ()

    // LogOut :
    const handleLogOut = async () => {
        //// Déconnexion à Firebase :
        if (firebaseUser) {
            const loggedOut = await logOut ()
            if (loggedOut) {
                toggleModals(MODAL_STATES.CLOSE)
                //MAJ de currentUser :
                updateCurrentUser (loggedOut)
            }
        }
    }

    return (
        <>
            { modalState === MODAL_STATES.MON_COMPTE && 
            <section 
                className="modalPage monCompteModalPage"
                onClick={() => toggleModals(MODAL_STATES.CLOSE)} 
                role="dialog"
                aria-modal="true"
                aria-labelledby="Modale Mon compte"          
            >
                <div className="modal monCompteModal" role="document">
                    <header className={styles.deconnect}>
                        <Logo logoWidth={80} />
                        <button 
                            onClick = {() => {
                                handleLogOut ()
                                window.location.href = "/"
                            }}
                            className="fakeButton"
                            style = {{paddingBottom: "5px"}}
                        >
                            Se déconnecter
                        </button>
                    </header>
                    <UserRoleLabel label = {currentUser.role} fontSize = "16px" />
                    <section className={styles.userInfosContainer}>
                        <Image
                            src={currentUser.photo_url || "/defaultAvatar.svg"}
                            alt={firebaseUser ? "Photo de profil" : "Icône utilisateur par défaut"}
                            width={80}
                            height={80}
                            className="profilePhoto"
                            onClick={()=> router.push ("/moncompte")}
                        />
                        <div className={styles.userInfosTexts}>
                            <span style = {{fontWeight : 800, fontSize : "17px"}}> {currentUser.firstname} {currentUser.lastname} </span>
                            <span> {currentUser.email} </span>
                            <Link 
                                href = {`/moncompte`}
                                style = {{textAlign : "left"}}    
                            >
                                <button className="fakeButton" onClick={()=> toggleModals(MODAL_STATES.CLOSE)} >Mon compte</button>
                            </Link>
                        </div>
                    </section>
                </div>
            </section>
            }
        </>
  )
}
