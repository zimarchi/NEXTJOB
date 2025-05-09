import { useAuth } from "@/lib/context/userContext";
import Image from "next/image";
import Logo from "../../logo/logo";
import styles from "./monCompteModal.module.css";
import Link from "next/link";
import { logOut } from "@/lib/modules/user/auth/logOut";
import { useRouter } from "next/navigation";
import CategorieLabel from "@/components/categorieLabel/categorieLabel";

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
                toggleModals("close")
                //MAJ de currentUser :
                updateCurrentUser (loggedOut)
            }
        }
    }

    return (
        <>
            { modalState === "monCompte" && 
            <div 
                className="modalPage monCompteModalPage"
                onClick={() => toggleModals("close")}            
            >
                <div className="modal monCompteModal">
                    <div className={styles.deconnect}>
                        <Logo photoSize={30} fontSize={"15px"}/>
                        <button 
                            onClick = {() => {
                                handleLogOut ()
                                window.location.href = "/"
                            }}
                            className="fakeButton"
                        >
                            Se déconnecter
                        </button>
                    </div>
                    <CategorieLabel label = {currentUser.categorie} fontSize = "16px" />
                    <div className={styles.userInfosContainer}>
                        <Image
                            src={currentUser.photo_url || "/defaultAvatar.svg"}
                            alt="Photo profil"
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
                                <button className="fakeButton" onClick={()=> toggleModals("close")} >Mon compte</button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
            }
        </>
  )
}
