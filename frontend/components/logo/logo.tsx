import Image from "next/image";

interface LogoProps {
  logoWidth: number;
  className?: string;
}

export default function Logo({logoWidth, className = ""} : LogoProps) {
  return (
    
    <Image
      src="/logo.svg"
      alt=""
      height={logoWidth/2}
      width={logoWidth}
      priority
      role = "img"
      aria-label="Logo de Hire Too"
      className={className}
    />
  )
}
