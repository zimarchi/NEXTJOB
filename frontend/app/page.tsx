import Image from "next/image";
import styles from "./page.module.css";
import Link from "next/link";

export default function HomePage() {
  return (
      <main className={styles.main}>
        <Link
          className={`${styles.link} ${styles.recruteur}`}
          href="/recruteur"
        >
          <h1>Je suis recruteur</h1>
        </Link>
        <Image
          className={styles.responsive}
          src="/job.jpg"
          alt="Image du job de tes rêves"
          width={500}
          height={500}
          priority
        />
        <Link
          className={`${styles.link} ${styles.candidat}`}
          href="/candidat"
        >
          <h1>Je suis candidat</h1>
        </Link>
      </main>
  );
}


