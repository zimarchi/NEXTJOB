import { useAuth } from "@/context/userContext"
import styles from "./userRoleLabel.module.css"
import { USER_ROLE_RECRUTEUR } from "@/constants/usersRoles";

interface UserRoleLabelProps {
    label: string | undefined;
    fontSize: string;
  }

export default function UserRoleLabel({label, fontSize}: UserRoleLabelProps) {

    // Etats via useContext
        const { currentUser } = useAuth ()


    return (
        <span
            className={styles.role}
            style = {{
                backgroundColor: currentUser.role === USER_ROLE_RECRUTEUR ? "var(--recruteur-color)" : "var(--candidat-color)",
                color: "white",
                fontSize: fontSize,
            }}
        >
            {label}
        </span>
    )
}
