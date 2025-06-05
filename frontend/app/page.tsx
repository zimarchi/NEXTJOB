import Logo from "@/components/logo/logo";
import styles from "./page.module.css";
import Link from "next/link";
import { USER_ROLE_CANDIDAT, USER_ROLE_RECRUTEUR } from "@/constants/usersRoles";

export default function HomePage() {
  return (
    <>
      <Link
        className={`${styles.link} ${styles.recruteur}`}
        href="/recruteur"
      >
        <span>Je suis</span>
        <span className={styles.role}>{USER_ROLE_RECRUTEUR}</span>
      </Link>
      <Logo logoWidth={300} className={styles.logo}/>
      <Link
        className={`${styles.link} ${styles.candidat}`}
        href="/candidat"
      >
        <span>Je suis</span>
        <span className={styles.role}>{USER_ROLE_CANDIDAT}</span>
      </Link>
    </>
  );
}


