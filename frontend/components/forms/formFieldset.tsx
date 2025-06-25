import { capitalize } from "@/utils/capitalize"

type FieldsetProps = {
  legend : string,
  infos: Record<string,string>[],
  fieldsetStyle: string,
  placeholders?: string [],
  labelStyle?: string,
  inputStyle?: string,
  selectStyle?: string,
  setFile?: React.Dispatch<React.SetStateAction<File | null>>,
  setURL?: React.Dispatch<React.SetStateAction<string | null>>
}

export default function Fieldset ({legend, infos, fieldsetStyle, placeholders=[], labelStyle, inputStyle, selectStyle, setFile, setURL} : FieldsetProps) { 
    
  return (
    <fieldset className={fieldsetStyle}>
      <legend>{legend}</legend>
      {infos.map ((info: Record<string, string>, i: number) => (
      <div key = {info.id} className ="field">
        <label htmlFor={info.id} className={labelStyle}>
          {info.label}
        </label>
        { info.type === "select" ? (
        <select
          className={selectStyle}
          id={info.id}
          name={info.name}
          title={info.label}
          required
        >
          <option value={info.option1}>{capitalize(info.option1)}</option>
          <option value={info.option2}>{capitalize(info.option2)}</option>
        </select>
        ) : (
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
            if (setFile && setURL) {
              const file = e.target.files?.[0]
              if (file) {
                const fileURL = URL.createObjectURL(file)
                setFile(file)
                setURL (fileURL)
              } else {
                setFile(null)
                setURL (null)
              }
            }
          } } : {})}
          
          required
        />
        )}
      </div>
      ))}
    </fieldset>
  )
}