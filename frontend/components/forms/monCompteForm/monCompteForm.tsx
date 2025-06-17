import styles from "./monCompteForm.module.css"
import { useAuth } from "@/context/userContext";

interface monCompteFormProps {
  infos : Record <string, string>[]
}

export default function MonCompteForm({infos}: monCompteFormProps) {

  const {toggleModals} = useAuth ()

  return (
    <section className={styles.inputsContainer}>
      {infos.map ((info : Record<string, string>, index: number) => (
      <article key = {index} className={styles.infoLine}>
          <div className={styles.field}>
              <span className={styles.label}>{info.label}</span>
              <span className={styles.value}>{info.value}</span>
          </div>
          <button className = "fakeButton" onClick={()=> toggleModals (info.modal)}>Modifier</button>
      </article>
      ))}
    </section>
  )
}
