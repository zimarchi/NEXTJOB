import { forwardRef } from "react"

type InputsProps = {
  legend : string,
  infos: Record<string,string>[],
  containerStyle: string,
  fieldStyle: string,
  placeholders: string [],
  labelStyle?: string,
}

/* Utilisation de forwardRef pour recevoir inputsRef depuis le composant parent Modale */ 
const HTMLInputsElements = forwardRef <HTMLInputElement[] | null, InputsProps> ( 
  ({legend, infos, containerStyle, fieldStyle, placeholders, labelStyle}, ref) => { 
    
    const castedRef = ref as React.RefObject<HTMLInputElement[]>
    
    return (
    <fieldset className={containerStyle}>
      <legend>{legend}</legend>
      {infos.map ((info: Record<string, string>, i: number) => (
        <div key = {info.id} className ={fieldStyle}>
          <label htmlFor={info.id} className={labelStyle}>
            {info.label}
          </label>
          <input 
            /* Renseignement de l'inputsRef pour remontée vers le composant parent Modale */
            ref = {(el) => {
              if (el && castedRef && !castedRef.current?.includes(el)) {
                castedRef.current?.push(el)
              }
            }}
            id = {info.id}
            {...(info.value ? { name : info.value } : {name : info.label})}
            type = {info.type}
            title = {info.label}
            placeholder = {placeholders.length > 0 ? placeholders[i] : info.placeholder}
            {...(info.value ? { value : info.value } : {} )}
            required
          />
        </div>
      ))}
    </fieldset>
  )}
)
      
HTMLInputsElements.displayName = "HTMLInputsElements"

export default HTMLInputsElements