import styles from "./updateFormInputs.module.css"
import { useAuth } from "@/lib/context/userContext";

interface UpdateFormInputsProps {
  label: string;
  value: string;
}

export default function HTMLInputElementFromUpdateForm({label, value}: UpdateFormInputsProps) {

    const {toggleModals} = useAuth ()

  return (
    <div className={styles.inputLine}>
        <div className={styles.labelValue}>
            <span className={styles.label}>{label}</span>
            <span className={styles.value}>{value}</span>
        </div>
        <button className = "fakeButton" onClick={()=> toggleModals ("updateFullName")}>Modifier</button>
    </div>
  )
}
