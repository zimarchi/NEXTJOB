import Image from "next/image";
import styles from "./logo.module.css"

export default function Logo({photoSize, fontSize}) {
  return (
    <div className= {styles.logoContainer}>
      <Image
          src="/logo.png"
          alt="Image du job de tes rêves"
          width={photoSize}
          height={photoSize}
          priority
      />
      <span style={{ fontSize: fontSize, fontWeight: 800 }}>NextJob</span>
    </div>
  )
}
