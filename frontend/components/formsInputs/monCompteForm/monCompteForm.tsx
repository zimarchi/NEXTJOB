import styles from "./monCompteForm.module.css"
import { useAuth } from "@/lib/context/userContext";

interface monCompteFormProps {
  infos : Record <string, string>[]
}

export default function MonCompteForm({infos}: monCompteFormProps) {

  const {toggleModals} = useAuth ()

  return (
    <div className={styles.inputsContainer}>
      {infos.map ((info : Record<string, string>, index: number) => (
      <div key = {index} className={styles.inputLine}>
          <div className={styles.labelValue}>
              <span className={styles.label}>{info.label}</span>
              <span className={styles.value}>{info.value}</span>
          </div>
          <button className = "fakeButton" onClick={()=> toggleModals (info.modal as "updateFullName" | "updateBirthDate")}>Modifier</button>
      </div>
      ))}
    </div>
  )
}
