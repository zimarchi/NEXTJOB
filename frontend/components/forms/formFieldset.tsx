type FieldsetProps = {
  legend : string,
  infos: Record<string,string>[],
  fieldsetStyle: string,
  placeholders?: string [],
  labelStyle?: string,
  inputStyle?: string,
  setFile?: React.Dispatch<React.SetStateAction<File | null>>,
  setURL?: React.Dispatch<React.SetStateAction<string | null>>
}

export default function Fieldset ({legend, infos, fieldsetStyle, placeholders=[], labelStyle, inputStyle, setFile, setURL} : FieldsetProps) { 
    
  return (
    <fieldset className={fieldsetStyle}>
      <legend>{legend}</legend>
      {infos.map ((info: Record<string, string>, i: number) => (
      <div key = {info.id} className ="field">
        <label htmlFor={info.id} className={labelStyle}>
          {info.label}
        </label>
        <input
          className={inputStyle}
          id = {info.id}
          name = {info.name}
          type = {info.type}
          title = {info.label}
          placeholder = {placeholders.length > 0 ? placeholders[i] : info.placeholder}
          {...(info.value ? { value : info.value } : {} )}
          {...(info.min ? { min : info.min } : {} )}
          // Gestion du téléversement de fichiers 
          {...(info.type === "file" ? { onChange : (e) => {
            if (e.target.files && setFile && setURL) {
              const photoFile = e.target.files[0]
              const photoURL = URL.createObjectURL(photoFile)
              setFile(photoFile)
              setURL (photoURL)
            }
          } } : {})}
          
          required
        />
      </div>
      ))}
    </fieldset>
  )
}