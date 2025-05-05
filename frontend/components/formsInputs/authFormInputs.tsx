import { forwardRef } from "react"

type InputsProps = {
  infos: Record<string,string>[],
  style: string,
  subStyle: string,
}

/* Utilisation de forwardRef pour recevoir inputsRef depuis le composant parent Modale */ 
const HTMLInputElementsFromAuthForm = forwardRef <HTMLInputElement[], InputsProps> ( 
  ({infos, style, subStyle}, ref) => { return (
    <div className={style}>
      {infos.map ((info: any) => (
        <div key = {info.id} className ={subStyle}>
          <label htmlFor={info.id}>
            {info.label}
          </label>
          <input 
            /* Renseignement de l'inputsRef pour remontée vers le composant parent Modale */
            ref = {(el) => {
              if (el && ref.current && !ref.current.includes(el)) {
                ref.current.push(el)
              }
            }}
            id = {info.id}
            {...(info.value ? { name : info.value } : {name : info.label})}
            type = {info.type}
            title = {info.label}
            placeholder = {info.placeholder}
            {...(info.value ? { value : info.value } : {} )}
            required
          />
        </div>
      ))}
    </div>
  )}
)
      
HTMLInputElementsFromAuthForm.displayName = "HTMLInputElementsFromAuthForm"

export default HTMLInputElementsFromAuthForm