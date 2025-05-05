import { useAuth } from "@/lib/context/userContext";
import Image from "next/image";
import Logo from "../../logo/logo";
import styles from "./monCompteModale.module.css";
import Link from "next/link";
import { logOut } from "@/lib/modules/auth/logOut";
import { useRouter } from "next/navigation";
import CategorieLabel from "@/components/categorieLabel/categorieLabel";

export default function MonCompteModale() {

    const router = useRouter ()

    // Etats via useContext
    const { toggleModals, modalState, currentUser, updateCurrentUser } = useAuth ()

    // LogOut :
    const handleLogOut = async () => {
        //// Déconnexion à Firebase :
        const loggedOut = await logOut (currentUser)
        if (loggedOut) {
            toggleModals("close")
            //MAJ de currentUser :
            updateCurrentUser (loggedOut)
        }
    }

    return (
        <>
            { modalState === "monCompte" && 
            <div className={styles.monComptePage}>
                <div className={styles.monCompteModale}>
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
