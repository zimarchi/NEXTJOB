import { useAuth } from "@/lib/context/userContext"
import styles from "./categorieLabel.module.css"

interface CategorieLabelProps {
    label: string;
    fontSize: string;
  }

export default function CategorieLabel({label, fontSize}: CategorieLabelProps) {

    // Etats via useContext
        const { currentUser } = useAuth ()


    return (
        <span
            className={styles.categorie}
            style = {{
                backgroundColor: currentUser.categorie === "recruteur" ? "var(--recruteur-background-color)" : "var(--candidat-background-color)",
                color: currentUser.categorie === "recruteur" ? "var(--recruteur-color)" : "var(--candidat-color)",
                fontSize: fontSize,
            }}
        >
            {label}
        </span>
    )
}
